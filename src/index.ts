import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client"

const app = express();
const prisma = new PrismaClient();
app.use(express.json())
app.use(cors())


app.get("/api/postings", async(req, res) => {
    const posts = await prisma.post.findMany();
    res.json(posts);
});

app.post("/api/postings", async(req, res) => {
    console.log("called"!);
    
    const { title, content, picture } = req.body;


    if(!title || !content || !picture) {
        return res.status(400)
        .send("title and content fields required");
    }
    try{
        const post = await prisma.post.create({
            data: { title, content, picture }
        })
        res.json(post);
    }catch(error){
        res.status(500).send("oops something went wrong");
    }
})

app.put("/api/postings/:id", async(req, res) => {
    console.log("called put");

    const {title, content, picture } = req.body;
    console.log(title);
    console.log(content);
    console.log(picture);
    const id = parseInt(req.params.id);

    if(!title || !content || !picture ){
        return res.status(400).send("title and content fields required");
    }

    if(!id || isNaN(id)){
        return res.status(400).send("Id must be a valid number");
    }

    try{
        const updatedPost = 
        await prisma.post.update({
            where: {id }, 
            data: {title, content, picture }
        })
        res.json(updatedPost);
    }catch (error) {
        res.status(500).send("Oops something went wrong");
    }

})

app.delete("/api/postings/:id", async(req, res) => {
    const id = parseInt(req.params.id);

    if(!id || isNaN(id)) {
        return res.status(400).send("ID must be a valid integer");
    }

    try{
        await prisma.post.delete({
            where : {id }
        });

        res.status(204).send();
    } catch (error) {
        res.status(500).send("Oops something went wrong");
    }


});

app.listen(5000, ()=> {
    console.log("server running on localhost:5000");
});