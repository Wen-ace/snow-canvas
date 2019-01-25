class Snow {
    constructor(options) {
        let defuaultOptions = {
            target: document.querySelector('canvas'),
            speed: 5,          // 雪花速度
            size: 10,           // 雪花尺寸
            num: 30,            // 雪花数量
            image: './hb.png',
        }
        this.options = Object.assign(defuaultOptions, options);
        this.ctx = this.options.target.getContext('2d');

        this.init();
        this._lastest_time_ = new Date().getTime();
    }

    init() {
        let img = new Image();
        this.__img = img;
        img.src = this.options.image;
        img.onload = () => {
            let c_width = this.options.target.width;
            let c_height = this.options.target.height;
            let origin_speed = this.options.speed;
            let origin_size = this.options.size;

            this.tasks = [];
            for (let i = 0; i < this.options.num; i++) {
                let isSin = Math.random() > 0.5 ? true : false;
                let offset = ~~(Math.random() * origin_size) - origin_size / 2;
                let y = ~~(Math.random() * c_height);
                let x = ~~(Math.random() * c_width) + Math.sin(y / 180 * Math.PI) + offset;
                let size = origin_size / 2 + ~~(Math.random() * origin_size);
                let speed = origin_speed / 2 + ~~(Math.random() * origin_speed) * size / origin_size / 2;
                let timer = ~~(Math.random() * 2000);
                let task = {
                    x,
                    y,              // 雪花初始位置
                    speed,
                    size,
                    timer,
                    isSin,
                    offset
                };
                this.tasks.push(task);
            }
            this.draw();
        }
    }
    createFollowTask() {
        let now = new Date().getTime();
        if (now - this._lastest_time_ < (1000 / this.options.num / this.options.speed * 5)) {
            return false;
        }
        this._lastest_time_ = now;
        let c_width = this.options.target.width;
        // let c_height = this.options.target.height;
        let origin_speed = this.options.speed;
        let origin_size = this.options.size;

        let isSin = Math.random() > 0.5 ? true : false;
        let offset = ~~(Math.random() * origin_size) - origin_size / 2;
        // let y = ~~(Math.random() * c_height);   
        let y = 0;
        let x = ~~(Math.random() * c_width) + offset;
        let size = origin_size / 2 + ~~(Math.random() * origin_size);
        let speed = origin_speed / 2 + ~~(Math.random() * origin_speed) * size / origin_size / 2;
        let timer = ~~(Math.random() * 2000);
        let task = {
            x,
            y,              // 雪花初始位置
            speed,
            size,
            timer,
            isSin,
            offset
        };
        this.tasks.unshift(task);

        if (task.y > this.options.target.height) {
            this.tasks = this.tasks.filter(v => {
                if (v == task) {
                    return null
                } else {
                    return v;
                }
            })
        }
    }
    draw() {
        this.createFollowTask();
        let tasks = this.tasks;
        let ctx = this.ctx;
        let img = this.__img;
        this.clear();
        tasks.forEach(v => {
            let scale = v.size / img.width;
            ctx.drawImage(img, v.x, v.y, v.size, img.height * scale);
            cancelAnimationFrame(this.raf);
            this.move(v);
        });
    }
    move(task) {
        task.y += task.speed;
        if (task.isSin) {
            task.x += Math.sin(task.y / 180 * Math.PI) * (task.size / 9);
        } else {
            task.x -= Math.sin(task.y / 180 * Math.PI) * (task.size / 9);
        }
        this.raf = requestAnimationFrame(this.draw.bind(this));

    }
    clear() {
        this.ctx.clearRect(0, 0, this.options.target.width, this.options.target.height);
    }
}
