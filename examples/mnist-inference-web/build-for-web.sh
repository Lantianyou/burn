
# Add wasm32 target for compiler.
rustup target add wasm32-unknown-unknown

if ! command -v wasm-pack &> /dev/null
then
    echo "wasm-pack could not be found. Installing ..."
    cargo install wasm-pack
fi

# Set optimization flags
export RUSTFLAGS="-C lto=fat -C embed-bitcode=yes -C codegen-units=1 -C opt-level=3"

# Run wasm pack tool to build JS wrapper files and copy wasm to pkg directory.
mkdir -p frontend/pkg
wasm-pack build --out-dir ./frontend/pkg --release --target web

if ! command -v pnpm &> /dev/null
then
    cd frontend && pnpm install && pnpm run build && pnpm run preview
else
    cd frontend && npm install && npm run build && npm run preview
fi