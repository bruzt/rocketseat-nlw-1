import express from 'express';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/users', (req, res) => {

    return res.json({ message: 'ok' });
})

app.listen((process.env.PORT || 3000), () => {
    console.log('Server running on port ' + (process.env.PORT || 3000));
});