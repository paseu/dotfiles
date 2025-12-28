import socket, re

def get_count():
    try:
        s = socket.socket(socket.AF_UNIX, socket.SOCK_STREAM)
        s.connect('/home/paseu/.rtorrent.session/rpc.sock')

        # rTorrent XML-RPC 요청 본문
        b = b'<?xml version="1.0"?><methodCall><methodName>d.multicall2</methodName><params><param><value><string></string></value></param><param><value><string>main</string></value></param><param><value><string>d.complete=</string></value></param></params></methodCall>'

        # SCGI 헤더 규격 적용
        h = f'CONTENT_LENGTH\x00{len(b)}\x00SCGI\x001\x00'.encode()
        s.sendall(f'{len(h)}:'.encode() + h + b',' + b)

        res = b""
        while True:
            chunk = s.recv(4096)
            if not chunk: break
            res += chunk
        s.close()

        # 완료 상태(1)인 항목 개수 추출
        return len(re.findall(rb'<(?:i8|int)>1</(?:i8|int)>', res))
    except:
        return 0

if __name__ == "__main__":
    print(get_count())

