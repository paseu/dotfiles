#
# ~/.bashrc
#

# If not running interactively, don't do anything
[[ $- != *i* ]] && return

alias ls='ls --color=auto'
#PS1='[\u@\h \W]\$ '

reset=$(tput sgr0)
PS1='\[$reset\][\u@\h \w]\$ '

# avoid duplicates..
export HISTCONTROL=ignoreboth  
# increase history size
export HISTSIZE=10000
export HISTFILESIZE=10000
# append history entries..
shopt -s histappend
# After each command, save and reload history
export PROMPT_COMMAND="${PROMPT_COMMAND:+$PROMPT_COMMAND$'\n'}history -a; history -c; history -r"
# journalctl wraps line instead of truncating
export SYSTEMD_LESS=FRXMK
