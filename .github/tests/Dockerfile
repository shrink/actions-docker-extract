FROM alpine

RUN mkdir -p /files/x
RUN mkdir -p /files/y

RUN echo "Hello, World 1! \$(date)" > /files/001.txt
RUN echo "Hello, World 2! \$(date)" > /files/002.txt
RUN echo "Hello, World 3! \$(date)" > /files/003.txt
RUN echo "Hello, World 4! \$(date)" > /files/x/004.txt
RUN echo "Hello, World 5! \$(date)" > /files/x/005.txt
RUN echo "Hello, World 6! \$(date)" > /files/y/006.txt

RUN mkdir -p /app/
RUN echo "<h1>Hello, World!</h1>" > /app/index.html
