$('#addsubmit').click(function () {
    if (!$('#addcheck').prop('checked')) {
        layer.tips('请勾选并同意使用协议', '#addcheck', {
            tips: [1, '#FF3366'],
        });
        return false;
    }
    ;
    var xuehao = $('#addxuehao').val();  // 学号
    var mima = $('#addmima').val();      // 密码
    var email = $('#addemail').val();  // 邮箱
    var beizhu = $('#addbeizhu').val();   // 备注
    ;
    if (xuehao == '') {
        $('#addxuehao').focus();
        layer.tips('请填写你的学号', '#addxuehao', {
            tips: [1, '#FF3366'],
        });
        return false;
    } else if (mima == '') {
        $('#addmima').focus();
        layer.tips('请填你的密码', '#addmima', {
            tips: [1, '#FF3366'],
        });
        return false;
    } else if (email === '') {
        $('#addemail').focus();
        layer.tips('请填写QQ邮箱', '#addemail', {
            tips: [1, '#FF3366'],
        });
        return false;
    } else if (email.search('@') === -1) {
        $('#addemail').focus();
        layer.tips('请填写完整QQ邮箱，以便通知你！', '#addemail', {
            tips: [1, '#FF3366'],
        });
        return false;
    } else if (beizhu == '') {
        $('#addbeizhu').focus();
        layer.tips('请填备注！', '#addbeizhu', {
            tips: [1, '#FF3366'],
        });
        return false;
    }
});