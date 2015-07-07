c:\Openssl\bin\openssl genrsa -out quiz-2015-key.pem 2048
c:\Openssl\bin\openssl req -new -sha256 -key quiz-2015-key.pem -out quiz-2015-csr.pem -config c:\Openssl\share\openssl.cnf
c:\Openssl\bin\openssl x509 -req -in quiz-2015-csr.pem -signkey quiz-2015-key.pem -out quiz-2015-cert.pem