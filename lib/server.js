const dev = process.env.NODE_ENV !== 'production'

const server = dev ? 'http://localhost:3000' : 'http://localhost:3000'

export default server
