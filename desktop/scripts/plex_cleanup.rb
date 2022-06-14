#!/usr/bin/env ruby

# At least for movies, it looks like it copies the 'selected' stuff into the
# _stored/ folder.  It also seems to use the _combined/ folder for access.
# so, I shoud be able to delete anything that's not those two.
# And after that, in the _combined folder, I can/should delete any broken links
# and remove them from <art> and <posters> in Info.xml.
# remove <reviews> from Info.xml too, since it seems to be unused.
# As far as I can tell, extras.xml can just be deleted?
# Same for Artists
# In Albums, similar, but just 'posters'.
# Probably just delete 'lyrics' because it's also unused?
# TV Shows similar - art, banners, posters, themes.  seasons is probably more complicated - need to revisit.

require 'pathname'
require 'nokogiri'

metadata = Pathname.new('/mnt/plexdata/Plex Media Server/Metadata/')

['Albums','Movies','TV Shows','Artists'].each do |dir|
  puts dir
  (metadata+dir).each_child do |a|
      puts a.basename
    a.each_child do |path|
      path += 'Contents'
      next unless path.exist?
      path.each_child do |dir|
        dir.rmtree unless ['_stored','_combined'].include? dir.basename.to_s
      end
      path += '_combined'
      #delete extras.xml
      extras = path + 'extras.xml'
      extras.unlink if extras.exist?
      #open _combined/Info.xml
      next unless (path + 'Info.xml').exist?
      info_file = (path + 'Info.xml').to_s
      info_xml = File.open(info_file){|f| Nokogiri::XML(f)}
      #remove <reviews><item> and <lyrics><items> from Info.xml
      ['reviews','lyrics'].each do |type|
        info_xml.search("//#{type}/item").each{|i| i.remove}
        info_xml.search("//#{type}").each{|n| n.inner_html = n.inner_html.gsub(/\n\s*\n/,'')}
      end
      ['art','banners','posters','themes'].each do |type|
        next unless (path+type).exist?
        (path + type).each_child do |link|
          next unless link.symlink?
          unless link.exist?
            name = link.basename.to_s
            link.unlink #delete broken symlink
            #remove from Info.xml
            info_xml.search("//#{type}/item[@preview='#{name}']").remove
            info_xml.search("//#{type}/item[@media='#{name}']").remove
          end
        end
        info_xml.search("//#{type}").each{|n| n.inner_html = n.inner_html.gsub(/\n\s*\n/,'')}
      end
      #write Info.xml
      File.open(info_file, 'w'){|f| f.write info_xml.to_xml}
    end
  end
end
