const {Schema, model, SchemaTypes} = require('mongoose');

const postSchema = new Schema ({
    title:  String,
    content:  String,
    editorId: {
        type: Schema.Types. ObjectId,
        ref: 'Editor'
    } 
},{
    timestamps: true
})

const Post = model('Post', postSchema);

module.exports = Post;