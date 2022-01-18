let month = ['January', 'Februari', 'March', 'April', 'May', 'June', 'July', 'August', 
            'September','October', 'November','December']

function getFullTime(time) {

  let date = time.getDate()
  let monthIndex = time.getMonth()
  let year = time.getFullYear()

  let hours = time.getHours()
  let minutes = time.getMinutes()


  let fullTime = `${date} ${month[monthIndex]} ${year} ${hours}:${minutes} WIB`

  return fullTime

}

function getDistanceTime(time) {

    let timePost = time
    let timeNow = new Date()
    let distance = timeNow - timePost
  
    let milisecond = 1000 
    let secondsInHours = 3600
    let hoursInDay = 23
  
    let seconds = 60
    let minutes = 60
  
    let distanceDay = distance / (milisecond * secondsInHours * hoursInDay)
    let distanceHours = Math.floor(distance / (milisecond * seconds * minutes))
    let distanceMinutes = Math.floor(distance / (milisecond * seconds))
    let distanceSecond = Math.floor(distance / milisecond)
  
  
    
    if (distanceDay >= 1) {
        return `${distanceDay} day ago`;
  
    } else if(distanceHours >= 1) {
      
        return `${distanceHours} hours ago`;
  
    } else if(distanceMinutes >= 1) {
     
        return `${distanceMinutes} minutes ago`;
  
    } else {
        return `${distanceSecond} seconds ago`;
    }
}

const db = require('./connection/db')


const { request } = require('express')
const express = require('express')
const app = express()
const PORT =5050

app.set('view engine', 'hbs')

app.use('/public' ,express.static(__dirname + '/public'))

app.use(express.urlencoded({extended: false}))

let isLogin = true

let blogs = [{

        title: 'Orang Terganteng Di Dunia Wow Nya Mna Amazing',
        postAt: '27 Jun 2007 12:30 WIB',
        author :'herdiyana-firmansyah',
        content:'Pemuda gagah nan tampan ini katanya bisa membuat wanita terpesona setelah meggunakan topi dari Zimbabwe, aksesoris berlian dan makan emas batangan 5 kg. Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quam, molestiae numquam! Deleniti maiores expedita eaque deserunt quaerat! Dicta, eligendi debitis?',
    
}]


app.get('/', function(request, response){

  

    let query = `SELECT * FROM t_exp`

    db.connect(function(err, client, done){
        if (err) throw err

        client.query(query,  function(err, result){
            if (err) throw err

            let data= result.rows.map((data)=>{
                return {
                    ...data
                }
            })

            response.render('index', { index: data})
        })
    })
    
})


app.get('/edit', function(request, response){
    response.render('edit')
})

app.get('/add-blog', function(request, response){
    response.render('add-blog')
})

app.get('/contact', function(request, response){
    response.render('contact')
})

app.get('/blog', function(request, response) {

    // let dataBlogs = blogs.map(function(data){
    //     return {
    //         ...data,
    //         isLogin: isLogin
    //     }
    // })

    db.connect(function(err, client, done) {

        if (err) throw err

        client.query('SELECT * FROM t_blog', function(err, result) {
           
            if (err) throw err

            // console.log(result.rows);

            let data = result.rows
            
            response.render('blog', {isLogin : isLogin, blogs: data})
        })
    })
})

app.get('/blog-detail/:id', function(request, response) {
    // console.log(req.params);
    
    let id = request.params.id

    db.connect(function (err, client, done){
        if (err)throw err

        client.query(`SELECT * FROM t_blog WHERE id = ${id}`, function(err, result){
            if (err) throw err

            let data = result.rows[0]
            console.log(data)
            response.render('blog-detail', {blog: data})
        })
    })
})

app.post('/blog', function(request, response) {

    // let dataDistance = getDistanceTime(time)
    // return dataDistance

    let data = request.body

    let query = `INSERT INTO t_blog(title, content, image) VALUES ['${data.inputTitle}', '${data.inputContent}', 
    'image.png']`

    db.connect(function(err, client, done) {

        if (err) throw err

        client.query(query, function(err, result) {
           
            if (err) throw err

            // console.log(result.rows);

           
            // console.log(data)
            response.redirect('blog')
        })
    })

})

// app.get('/blog-update', function(request, response){
//     let id = req.params.id
//     let data =
// })
  

app.get('/delete-blog/:id', function(request, response){

    let id = request.params.index;

    let query = `DELETE FROM t_blog WHERE id = ${id}`
    
    db.connect(function(err, client, done){
        if (err) throw err

        client.query(query, function(err,result){
            if (err) throw err

            response.redirect('/blog')
        })
    })

    response.redirect('/blog')

})

app.get('/edit/:index', (request,response) => {
    response.render('edit')
})

app.post('/edit/:index', (request, response) => {

   let index = request.params.index

    blogs[index].title = request.body.updateTitle
    blogs[index].content = request.body.updateContent


    // console.log(blogs);
    response.redirect('/blog')
})


app.listen(PORT, function(request, response){
    console.log('Wellcome to Mobile Legends')
})

