import socket
import re
import os

def get_count():
    socket_path = '/home/paseu/.rtorrent.session/rpc.sock'

    # 1. 소켓 파일이 없으면 rtorrent가 꺼진 것으로 간주
    if not os.path.exists(socket_path):
        return "OFF"

    try:
        s = socket.socket(socket.AF_UNIX, socket.SOCK_STREAM)
        s.settimeout(1)  # 1초 내에 응답 없으면 에러 처리
        s.connect(socket_path)

        # rTorrent XML-RPC 요청
        b = b'<?xml version="1.0"?><methodCall><methodName>d.multicall2</methodName><params><param><value><string></string></value></param><param><value><string>main</string></value></param><param><value><string>d.complete=</string></value></param></params></methodCall>'
        h = f'CONTENT_LENGTH\x00{len(b)}\x00SCGI\x001\x00'.encode()
        s.sendall(f'{len(h)}:'.encode() + h + b',' + b)

        res = b""
        while True:
            chunk = s.recv(4096)
            if not chunk: break
            res += chunk
        s.close()

        # 완료된 항목(값 1) 개수 카운트
        count = len(re.findall(rb'<(?:i8|int)>1</(?:i8|int)>', res))
        return str(count)
    except:
        # 연결 거부 등 에러 발생 시 OFF 반환
        return "OFF"

if __name__ == "__main__":
    print(get_count())

