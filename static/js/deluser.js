$('#delsubmit').click(function () {
    if (!$('#delcheck').prop('checked')) {
        layer.tips('请勾选并同意使用协议', '#delcheck', {
            tips: [1, '#FF3366'],
        });
        return false;
    }
    ;
    var xuehao = $('#delxuehao').val();  // 学号
    var mima = $('#delmima').val();      // 密码
    var email = $('#delemail').val();  // 邮箱
    var beizhu = $('#delbeizhu').val();   // 备注
    ;
    if (xuehao == '') {
        $('#delxuehao').focus();
        layer.tips('请填写你的学号', '#delxuehao', {
            tips: [1, '#FF3366'],
        });
        return false;
    } else if (mima == '') {
        $('#delmima').focus();
        layer.tips('请填你的密码', '#delmima', {
            tips: [1, '#FF3366'],
        });
        return false;
    } else if (email === '') {
        $('#delemail').focus();
        layer.tips('请填写QQ邮箱', '#delemail', {
            tips: [1, '#FF3366'],
        });
        return false;
    } else if (email.search('@') === -1) {
        $('#delemail').focus();
        layer.tips('请填写完整QQ邮箱，以便通知你！', '#delemail', {
            tips: [1, '#FF3366'],
        });
        return false;
    } else if (beizhu == '') {
        $('#delbeizhu').focus();
        layer.tips('请填备注！', '#delbeizhu', {
            tips: [1, '#FF3366'],
        });
        return false;
    }
});