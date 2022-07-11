let post_api_url = 'https://awiclass.monoame.com/api/command.php?type=get&name=post';

Vue.component('postbox', {
    template: '#post',
    props: ['post'],
    computed: {
        cover_url() {
            if (this.post.cover.indexOf('http') != -1) {
                return this.post.cover;
            } else {
                return 'http://zashare.org' + this.post.cover;
            }
        },
        cover_css() {
            return {
                "background-image": 'url(' + this.cover_url + ')'
            }
        }
    },
});

let vm = new Vue({
    el: '#app',
    data: {
        posts: [],
        filter: ''
    },
    computed: {
        filter_post() {
            let vobj = this;
            return this.posts.filter((post) => {
                let tag = ['title', 'name_short', 'description'];
                let flag = false;
                tag.forEach((now_tag) => {
                    // console.log(post[new_tag]);
                    if (post[now_tag].indexOf(vobj.filter) != -1) {
                        flag = true;
                    }
                });
                return flag;
            }).map((post) => {
                let temp_post = JSON.parse(JSON.stringify(post)); //利用JSON轉換可拷貝一份資料出來且不影響原本的資料
                //擷取描述
                temp_post.description = temp_post.description.substring(0, 60); //只抓出前60個字

                // 如果查到空白字就不進行過濾直接return原本的回去
                if (vobj.filter == '') return temp_post;
                let tag = ['title', 'name_short', 'description'];

                tag.forEach((now_tag) => {
                    // console.log(temp_post[now_tag]);
                    let re = new RegExp(vobj.filter, "i");
                    console.log(re);
                    let match_word = temp_post[now_tag].match(re);

                    if (match_word) {
                        temp_post[now_tag] = temp_post[now_tag].replace(new RegExp(vobj.filter, "i"), `<span class=highlight>${match_word}</span>`);
                    }

                });
                return temp_post;
            })
        }
    },
    mounted: function() {
        let vobj = this;
        $.get(post_api_url).then(function(res) {
            // console.log(vobj.posts = JSON.parse(res));
            vobj.posts = JSON.parse(res);
        });
    }
})