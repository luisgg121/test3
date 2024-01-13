// authController.js
const users = {}; // Simulación de base de datos en memoria

exports.login = (req, res) => {
    const { username, password } = req.body;
    const user = users[username];
    if (user && user.password === password) {
        // Lógica de inicio de sesión   
        res.json({ success: true, token: 'fake-jwt-token' });
    } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
};

exports.register = (req, res) => {
    const { username, password } = req.body;
    if (users[username]) {
        res.status(400).json({ success: false, message: 'Username already exists' });
    } else {
        // Lógica de registro
        users[username] = { username, password };
        res.json({ success: true, message: 'Registration successful' });
    }
};

