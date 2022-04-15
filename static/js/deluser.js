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
    ;
    if (xuehao == '') {
        $('#delxuehao').focus();
        layer.tips('请填写你的学号', '#delxuehao', {
            tips: [1, '#FF3366'],
        });
        return false;
    } else if (mima == '') {
        $('#mima').focus();
        layer.tips('请填你的密码', '#delmima', {
            tips: [1, '#FF3366'],
        });
        return false;
    }
});
