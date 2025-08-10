import React from 'react'
import { useState, useEffect } from 'react'
import { format } from 'date-fns'

const PostForm = () => {

    const [name, setName] = useState("")
    const [title, setTitle] = useState("")
    const [imageurl, setimageurl] = useState("")
    const [description, setdescription] = useState("")
    const [posts, setPosts] = useState([])
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const [edit, setEdit] = useState(null)


    useEffect(() => {
        getApi()
    }, [])


    // this function is API get with method "GEt"
    async function getApi() {
        setLoading(true)
        try {
            const response = await fetch('https://688f3bdcf21ab1769f8896f2.mockapi.io/CreatePost', {
                method: "GET",
                headers: { "Content-Type": "application/json" }
            });
            const data = await response.json()
            setPosts(data)
            // console.log(data)
        } catch (error) {
            setError("Failed to create post");
            console.log("ERROR", error);
        } finally {
            setLoading(false);
        }
    }

    // this function is post delet with API id method "DELETE"    
    const mainDelete = async (id) => {

        try {
            const response = await fetch(`https://688f3bdcf21ab1769f8896f2.mockapi.io/CreatePost/${id}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" }
            });
            const postDelete = await response.json();
            console.log(postDelete);
            setPosts(posts.filter(post => post.id !== id))


        } catch (error) {
            setError("Failed to delete post");
            console.log("ERROR", error);
        } finally {
            setLoading(false);
        }
    }
    // this function is Post Edit with API id method "PUT" 
    const handleEdit = (id) => {
        // if(!edit)return;

        const editpost = posts.find(post => post.id === id)
        setEdit(editpost)

        setName(editpost.name);
        setTitle(editpost.title);
        setimageurl(editpost.avatar);
        setdescription(editpost.description);

    }

    const handleUpdate = async () => {
        if (!edit) return

        const updatedData = {
            name: name,
            title: title,
            avatar: imageurl,
            description: description
        }

        try {
            setLoading(true)
            const response = await fetch(`https://688f3bdcf21ab1769f8896f2.mockapi.io/CreatePost/${edit.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedData)
            })

            const updatedPost = await response.json()

            setPosts(posts.map(post =>
                post.id === edit ? updatedPost : post
            ))

            // Reset form and editing state
            setEdit(null)
            setName("")
            setTitle("")
            setimageurl("")
            setdescription("")

        } catch (error) {
            setError("Failed to update post")
            console.log("ERROR", error)
        } finally {
            setLoading(false)
        }
    }


    // this function is Create Post with API method "POST"
    function createPost() {
        const newData = {
            name: name,
            title: title,
            avatar: imageurl,
            description: description

        };

        if (!name || !title || !imageurl || !description) {
            alert("Please fill all fields");
            return;
        }
        setLoading(true);
        async function postAPI() {
            try {
                const response = await fetch(`https://688f3bdcf21ab1769f8896f2.mockapi.io/CreatePost`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(newData)
                });
                const parseUpdate = await response.json()
                // console.log(parseUpdate)
                setPosts([parseUpdate, ...posts])
                setName("");
                setTitle("");
                setimageurl("");
                setdescription("");
            } catch (error) {
                console.log("ERROR", error)
            }

        }
        postAPI()
    }


    return (
        <div>
            <h1 className='mainheading'>CRUD Application</h1>
            {error && <div className="error">{error}</div>}
            {loading && <div className="loading"></div>}

            <div className='main'>
                <div className="mainCard">
                    <h2 className='haed2'>Create Post</h2>
                    <div className='inputthem'>
                        <input type="text" id='name' maxLength={'25px'} value={name} onChange={(e) => setName(e.target.value)} placeholder='Enter Your Name' />
                    </div>
                    <div className='inputthem'>
                        <input type="text" id='title' maxLength={'25px'} value={title} onChange={(e) => setTitle(e.target.value)} placeholder='Enter Title' />
                    </div>
                    <div className='inputthem'>
                        <input type="text" id='imageurl' value={imageurl} onChange={(e) => setimageurl(e.target.value)} placeholder='Enter Your Image URL' />
                    </div>
                    <div className='inputthem'>
                        <textarea style={{ fontSize: '19px', }} maxLength={'0px'} name="" id="message" value={description} onChange={(e) => setdescription(e.target.value)} placeholder='Enter Your Message'></textarea>
                    </div>
                    <div className='inputthem'>
                        <button onClick={!edit ? createPost : handleUpdate}>{edit ? 'Update Post' : 'Create Post'}</button>
                    </div>
                </div>
                <div className="mainPost">
                    {posts.map((item) =>
                        <div className="showpost" key={item.id}>
                            <div>
                                <div className='time'>{format(new Date(item.createdAt), 'MMM dd, yyyy p ')}  </div>
                                <img id='imageurlpost' src={item.avatar} alt="" />
                                <div className='namediv'>{item.name}</div>
                                <h5 className='posttitlt'>{item.title}</h5>
                                <p className="description">{item.description}</p>
                            </div>
                            <div className='btnfuc'>
                                <button className='btne' onClick={() => handleEdit(item.id)}>Edit</button>
                                <button className='btnd' onClick={() => mainDelete(item.id)}>Delete</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

        </div>
    )
}

export default PostForm