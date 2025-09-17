const configs = {
    backend: {
        port: 3000,
        database: {
            host: "localhost",
            port: 5432,
            name: "mystore",
            user: "myuser",
            password: "mypassword"
        }
    },
    frontend: {
        port: 3001,
        siteName: "Nasriya Store"
    }
}

export default configs;