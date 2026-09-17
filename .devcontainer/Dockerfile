FROM mcr.microsoft.com/devcontainers/javascript-node:26-bookworm

USER node

# install claude code
RUN npm install -g @anthropic-ai/claude-code 
RUN npm cache clean --force

# install elan
RUN curl https://elan.lean-lang.org/elan-init.sh -sSf | sh -s -- -y 
ENV PATH="/home/node/.elan/bin:${PATH}"

