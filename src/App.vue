<template>
    <div class="warn" :class="{ warning: warning }">
        <p>{{ warningTips }}</p>
    </div>
    <div class="pop" v-if="showGrade">
        <h3>成绩详情</h3>
        <div class="list">
            <div class="key">学校</div>
            <div class="value">{{ grade.school }}</div>
            <div class="key">姓名</div>
            <div class="value">{{ grade.name }}</div>
            <div class="key">考试类别</div>
            <div class="value">{{ grade.type }}</div>
            <div class="key">考试时间</div>
            <div class="value">{{ grade.time }}</div>
            <div class="key">准考证号</div>
            <div class="value zkz">{{ grade.ticket }}</div>
            <div class="key">成绩总分</div>
            <div class="value sum">{{ grade.grade.sum }}</div>
            <div class="key">听力</div>
            <div class="value">{{ grade.grade.listen }}</div>
            <div class="key">阅读</div>
            <div class="value">{{ grade.grade.read }}</div>
            <div class="key">写作和翻译</div>
            <div class="value">{{ grade.grade.write }}</div>
        </div>
        <div class="tips">
            <p>本次四级成绩在425分及以上（含425分），或六级成绩为425分以上（含425分），具备口试报名资格。</p>
        </div>
        <button @click="closeGrade">关  闭</button>
    </div>
    <div class="popMask" v-if="showGrade"></div>
    <header>
        四六级成绩查询
        <span>This is a open source project, see more: <a href="https://github.com/jas0ncn/cet">Jas0ncn · CET</a></span>
    </header>
    <div class="mobileTips">
        <p>本项目是个开源项目，欢迎到 <a href="https://github.com/jas0ncn/cet">Github</a> 查看源码并一起交流。欢迎 star :)</p>
        <p>受限于资源，暂时仅提供<b>深大</b>学生查询成绩。你可以 clone 项目源码，部署到本地后查询其他学校学生成绩。且大规模查询可能导致网站不稳定，你可以刷新页面重试。</p>
        <p>由于成绩涉及隐私信息，本网站对成绩不做任何储存，查询结果请自行截图保存！</p>
    </div>
    <div class="form">
        <label for="name">姓名：</label>
        <input type="text" name="name" placeholder="必填，大于3个字填前3个字" v-model="stuname">
        <label for="ticket">准考证：</label>
        <input type="text" name="ticket" placeholder="选填，15位准考证" v-model="ticket">
        <input type="radio" value="1" v-model="cetType" checked>四级
        <input type="radio" value="2" v-model="cetType">六级
        <button @click="query">查  询</button>
    </div>
    <footer>
        <p>Coded By <a href="https://github.com/jas0ncn">Jas0ncn</a></p>
    </footer>
</template>

<script>
export default {
    data () {
        return {
            stuname: '',
            ticket: '',
            cetType: '',
            showGrade: false,
            warning: false,
            warningTips: '',
            grade: {}
        }
    },
    methods: {
        query () {
            if (this.stuname === '') {
                this.warningTips = '姓名要填哦！'
                this.warning = true
                setTimeout(() => {
                    this.warning = false
                }, 2000)
                return
            }
            const url = this.ticket.length === 15 ? '/api/cetGrade/' + this.stuname + '/' + this.ticket : '/api/cetGradeNoTicket/' + this.stuname + '/深圳大学/' + this.cetType
            this.$http.get(url).then(res => {
                if (res.data.status === 200) {
                    if (res.data.data === 'No fetch') {
                        this.warningTips = '没有找到你的成绩！'
                        this.warning = true
                        setTimeout(() => {
                            this.warning = false
                        }, 2000)
                    } else {
                        this.grade = res.data.data
                        this.showGrade = true
                    }
                } else {
                    this.warningTips = res.data.info
                    this.warning = true
                    setTimeout(() => {
                        this.warning = false
                    }, 2000)
                }
            }, () => {
                this.warningTips = '服务器错误'
                this.warning = true
                setTimeout(() => {
                    this.warning = false
                }, 2000)
            })
        },
        closeGrade () {
            this.showGrade = false
        }
    }
}
</script>

<style>
body {
    background: #FFF;
    max-width: 600px;
    margin: 0 auto;
}
</style>

<style lang="less" scoped>

body {
    padding: 0;
}

header {
    height: 100px;
    color: #FFF;
    font-size: 28px;
    text-shadow: 0 0 5px rgba(0,0,0,.4);
    line-height: 100px;
    background-image: url('./assets/bg.jpg');
    background-size: 100% 100%;
    text-align: center;

    span {
        display: none;
    }
}

.warn {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 40px;
    background: #F45757;
    color: #FFF;
    text-align: center;
    transition: 300ms ease;
    transform: translateY(-100%);

    p {
        font-size: 14px;
        font-weight: bold;
        line-height: 40px;
    }
}

.warning {
    transform: translateY(0);
}

.mobileTips {
    width: 94%;
    margin-left: 3%;
    margin-top: 10px;
    padding: 10px;
    color: #333;
    background: #F8F8F8;
    border-radius: 6px;
    border: 1px solid #eee;

    p {
        font-size: 13px;
        line-height: 18px;
        text-indent: 2em;
        text-align: justify;

        a {
            color: blue;
            text-decoration: underline;
        }

        b {
            color: #F45757;
        }
    }
}

.form {
    width: 94%;
    margin-left: 3%;
    margin-top: 10px;
    padding: 0 10px;
    color: #222;

    label {
        font-size: 14px;
        line-height: 20px;
    }

    input[type="text"] {
        width: 100%;
        height: 36px;
        margin: 5px 0;
        padding: 0 10px;
        font-size: 14px;
        line-height: 36px;
        background: #F6F6F6;
        border-radius: 4px;
        border: 1px solid #ccc;
    }

    input[type="radio"] {
        width: 16px;
        height: 16px;
        margin: 10px 0;
        background: #F6F6F6;
        border-radius: 4px;
        border: 1px solid #ccc;
        -webkit-appearance: radio;
    }

    button {
        width: 100%;
        height: 36px;
        margin: 10px 0;
        color: #FFF;
        font-size: 16px;
        line-height: 34px;
        background: #46d14c;
        border: 1px solid #45b94a;
        border-radius: 4px;

        &:active {
            background: #45b94a;
        }
    }
}

.pop {
    position: fixed;
    width: 80%;
    height: 80%;
    left: 10%;
    top: 10%;
    background: #FFF;
    box-shadow: 0 5px 10px rgba(0,0,0,.3);
    border-radius: 6px;
    z-index: 11;
    overflow: auto;

    h3 {
        color: #FFF;
        font-size: 16px;
        text-align: center;
        line-height: 40px;
        background: #F45757;
        border-radius: 6px 6px 0 0;
    }

    .list {
        float: left;
        width: 80%;
        margin-top: 20px;
        margin-left: 10%;
        display: flex;
        font-size: 15px;
        line-height: 30px;
        flex-wrap: wrap;
        align-items: center;

        .key {
            width: 45%;
            padding: 0 5px;
            color: #111;
            font-weight: bold;
            text-align: right;
        }

        .value {
            width: 55%;
            font-size: 14px;
            color: #444;
            text-align: left;
            padding: 0 5px;
        }

        .zkz {
            font-size: 12px;
        }

        .sum {
            color: #F45757;
            font-size: 16px;
            font-weight: bold;
        }
    }

    .tips {
        float: left;
        width: 100%;
        padding: 10px;

        p {
            color: #aaa;
            font-size: 12px;
        }
    }

    button {
        float: left;
        width: 80%;
        height: 36px;
        margin-left: 10%;
        color: #888;
        font-size: 16px;
        line-height: 34px;
        background: #FFF;
        border: 1px solid #eee;
        border-radius: 4px;

        &:active {
            background: #eee;
        }
    }
    
}

.popMask {
    position: fixed;
    height: 100%;
    width: 100%;
    background: rgba(0,0,0,.7);
    z-index: 10;
}

footer {
    margin-top: 10px;
    width: 100%;
    text-align: center;

    p {
        font-size: 12px;
        color: #aaa;

        a {
            color: #888;
            text-decoration: underline;
        }
    }
}

</style>
