//For ExpressJS
const express = require('express');
const app = express();
const port = 3000;
//For EJS
const ejs = require('ejs');
//For Mongoose
const mongoose = require('mongoose');
const { json } = require('express');


mongoose.connect('mongodb://localhost:27017/wikiDB', { useNewUrlParser: true, useUnifiedTopology: true });

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));


const articleSchema = {
    title: String,
    content: String
};

const Article = mongoose.model('Article', articleSchema);

////////////////////////////////Requests Targeting All Articles\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

app.route("/articles")

    .get((req, res) => {

        const query = Article.find({});

        query.exec((err, foundArticles) => {
            if (!err) {
                res.send(foundArticles);
            } else {
                res.send(err);
            }
        });
        // });
        // Article.find({}, (err, foundArticles) => {
        //     if (!err) {
        //         res.send(foundArticles);
        //     } else {
        //         res.send(err);
        //     }
        // });
    })

    .post((req, res) => {
        const title = req.body.title;
        const content = req.body.content;

        const newArticle = new Article({
            title: title,
            content: content
        });

        newArticle.save((err) => {
            if (!err) {
                res.send('Successfully added a new article!');
            } else {
                res.send(err);
            }
        });
    })


    .delete((req, res) => {
        Article.deleteMany((err) => {
            if (!err) {
                res.send("Sucessfully deleted all articles!");
            } else {
                res.send(err);
            }
        });
    });


////////////////////////////////Requests Targeting A Specific Article\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

app.route("/articles/:articleTitle")

    .get((req, res) => {
        Article.findOne({ title: req.params.articleTitle }, (err, foundArticle) => {
            if (foundArticle) {
                res.send(foundArticle);
            } else {
                res.send(`No articles found with that name!`);
            }
        })
    })

    .put((req, res) => {
        Article.replaceOne(
            { title: req.params.articleTitle },
            { title: req.body.title, content: req.body.content },
            { overwrite: true },
            (err, results) => {
                if (!err) {
                    res.send("Sucessfully updated article. (Replaced)");
                }
            }
        )
    })

    .patch((req, res) => {
        Article.updateMany(
            { title: req.params.articleTitle },
            {$set: req.body},
            (err) => {
                if (!err) {
                    res.send("Sucessfully updated article. (Patched)");
                } else {
                    res.send(err);
                }
            }
        )
    })

    .delete((req, res) => {
        Article.deleteOne(
            {title: req.params.articleTitle},
            (err) => {
                if(!err) {
                    res.send(`Sucesfully deleted article named ${req.params.articleTitle}`)
                } else {
                    res.send(err);
                }
            }
        )
    });


app.listen(port, () => {
    console.log(`App is running on port: ${port}.`);
});