let createError = require('http-errors');
let express = require('express');
let path = require('path');
let fs = require('fs');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let multer  = require('multer');
let upload = multer({ dest: 'uploads/' });
let indexRouter = require('./routes/index');
let adminRouter = require('./routes/admin');
let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'uploads')));

app.use('/', indexRouter);
app.use('/admin', adminRouter);
//上传图片的方法
app.post('/uploadimg', upload.single('file'), (req, res) => {
    let file = req.file;
    let date = new Date();
    let dirname = [date.getFullYear(),date.getMonth()+1,date.getDate()].join('-');
    let extname = file.mimetype.split('/')[1];
    let imgname = date.getTime() + Math.floor(Math.random()*1000) + '.' + extname;
    let pathname = __dirname + '/uploads/' + dirname;
    if (!fs.existsSync(pathname)) {
        fs.mkdirSync(pathname);
    }
    fs.readFile(file.path,(error,data) => {
        if (error) {throw error}
        fs.writeFile(pathname+'/'+imgname,data,(error) => {
            if (error) {throw error}
            fs.unlinkSync(file.path);
            res.send('/'+dirname+'/'+imgname);
        })
    });
});
//删除上传的图片的方法
app.get('/removeimg',(req,res) => {
    let pathname = __dirname + '/uploads' +  req.query.url;
    fs.unlink(pathname,(error) => {
        if (error) {throw error}
        res.json({code:0,msg:'删除成功！'});
    })
});
//富文本编辑器上传图片的方法
app.post('/uploadeditor', upload.single('file'), (req, res) => {
    let file = req.file;
    let date = new Date();
    let dirname = [date.getFullYear(),date.getMonth()+1,date.getDate()].join('-');
    let extname = file.mimetype.split('/')[1];
    let imgname = date.getTime() + Math.floor(Math.random()*1000) + '.' + extname;
    let pathname = __dirname + '/uploads/' + dirname;
    if (!fs.existsSync(pathname)) {
        fs.mkdirSync(pathname);
    }
    fs.readFile(file.path,(error,data) => {
        if (error) {throw error}
        fs.writeFile(pathname+'/'+imgname,data,(error) => {
            if (error) {throw error}
            fs.unlinkSync(file.path);
            res.send({
                error: 0,
                data: ['/'+dirname+'/'+imgname],
            });
        })
    });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
