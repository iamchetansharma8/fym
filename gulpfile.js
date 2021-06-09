const gulp=require('gulp');
const cssnano=require('gulp-cssnano');
const rev=require('gulp-rev');
const uglify=require('gulp-uglify-es').default;
const imagemin=require('gulp-imagemin');
const del=require('del');

// css task
gulp.task('css',function(done){
    console.log('minifying css....'); 
    gulp.src('./assets/**/*.css') // telling source
    .pipe(cssnano())  // cssnano to minify css
    .pipe(rev()) // adding hash
    .pipe(gulp.dest('./public/assets')) // telling destination
    .pipe(rev.manifest('./public/assets/rev-manifest.json',{ 
        base:'./public/assets', // telling directory where manifest is to be saved
        merge:true // merging new changes if files already exist
    }))
    .pipe(gulp.dest('./public/assets')); //destination (again)
    done(); // calling done
});

// js task

gulp.task('js',function(done){
    console.log('minifying js....');
    gulp.src('./assets/**/*.js')
    .pipe(uglify())
    .pipe(rev())
    .pipe(gulp.dest('./public/assets'))
    .pipe(rev.manifest('./public/assets/rev-manifest.json',{
        base:'./public/assets',
        merge:true
    }))
    .pipe(gulp.dest('./public/assets'));
    done();
});

gulp.task('images', function(done){
    console.log('compressing images.....');
    gulp.src('./assets/**/*.+(png|jpg|jpeg|gif|svg)')
    .pipe(imagemin())
    .pipe(rev())
    .pipe(gulp.dest('./public/assets'))
    .pipe(rev.manifest('./public/assets/rev-manifest.json',{
        base:'./public/assets',
        merge:true
    }))
    .pipe(gulp.dest('./public/assets'));
    done();
});

// to empty public assets directory
gulp.task('clean:assets',function(done){
    del.sync('./public/assets');
    done();
});

// a task to run all those 4 tasks in series one after other
gulp.task('build', gulp.series('clean:assets','images','css','js'),function(done){
    console.log('building assets :: gulp');
    done();
});