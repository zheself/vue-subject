import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import cors from 'cors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(express.json());
app.use(cors());

const userFilePath = path.join(__dirname, 'users.json');

// 处理用户注册请求
app.post('/api/register', (req, res) => {
    let users = [];
    try {
        if (fs.existsSync(userFilePath)) {
            users = JSON.parse(fs.readFileSync(userFilePath, 'utf8'));
        }
    } catch (err) {
        console.error('读取用户文件失败:', err);
    }

    const newUser = req.body;
    users.push(newUser);

    fs.writeFileSync(userFilePath, JSON.stringify(users, null, 2), 'utf8');
    res.json({ message: '用户注册成功', user: newUser });
});

// 处理用户登录请求
app.post('/api/login', (req, res) => {
    let users = [];
    try {
        if (fs.existsSync(userFilePath)) {
            users = JSON.parse(fs.readFileSync(userFilePath, 'utf8'));
        }
    } catch (err) {
        console.error('读取用户文件失败:', err);
        return res.status(500).json({ message: '登录失败，请稍后重试' });
    }

    const { username, password } = req.body;
    const matchedUser = users.find(user => user.username === username && user.password === password);

    if (matchedUser) {
        res.json({ message: '登录成功', user: matchedUser });
    } else {
        res.status(401).json({ message: '用户名或密码错误' });
    }
});

app.listen(3000, () => console.log('服务器运行在 http://localhost:3000'));