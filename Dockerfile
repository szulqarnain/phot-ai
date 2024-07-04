# Use the official Rust image as the base image
FROM rust:latest

# Create a new empty shell project
RUN USER=root cargo new --bin cte-skysync-rust
WORKDIR /cte-skysync-rust

# Copy our main application code
COPY . .

# Build the application
RUN cargo build --release

# Run the application
CMD ["./target/release/cte-skysync-rust"]
