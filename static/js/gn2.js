$('#submit').click(function () {
    if (!$('#check').prop('checked')) {
        layer.tips('请勾选并同意使用协议', '#check', {
            tips: [1, '#FF3366'],
        });
        return false;
    }
    ;
    var xuehao = $('#xuehao').val();  // 学号
    var mima = $('#mima').val();      // 密码
    var email = $('#email').val();  // 邮箱
    var beizhu = $('#beizhu').val();   // 备注
    ;
    if (xuehao == '') {
        $('#xuehao').focus();
        layer.tips('请填写你的学号', '#xuehao', {
            tips: [1, '#FF3366'],
        });
        return false;
    } else if (mima == '') {
        $('#mima').focus();
        layer.tips('请填你的密码', '#mima', {
            tips: [1, '#FF3366'],
        });
        return false;
    } else if (email === '') {
        $('#email').focus();
        layer.tips('请填写QQ邮箱', '#email', {
            tips: [1, '#FF3366'],
        });
        return false;
    } else if (email.search('@') === -1) {
        $('#email').focus();
        layer.tips('请填写完整QQ邮箱，以便通知你！', '#email', {
            tips: [1, '#FF3366'],
        });
        return false;
    } else if (beizhu == '') {
        $('#beizhu').focus();
        layer.tips('请填备注！', '#beizhu', {
            tips: [1, '#FF3366'],
        });
        return false;
    }
});