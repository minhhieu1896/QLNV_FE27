var Validation = function () {
    // kiem tra Rỗng
    var value, isValid, pattern;
    return{
        KiemTraRong: function(idThongBao, noiDungThongBao) {
            value = document.getElementById('msnv').value;
            isValid = true;

            Reject(value === '', idThongBao, noiDungThongBao);
            
            return isValid;
        },

        KiemTraEmail: function(idThongBao, noiDungThongBao) {
            value = document.getElementById('email').value;
            isValid = true;
            pattern = /\S+@\S+\.\S+/;

            Reject(pattern.test(value), idThongBao, noiDungThongBao);

            return isValid;
        },

        KiemTraChucVu: function(idThongBao, noiDungThongBao) {
            value = document.getElementById('chucvu').selectedIndex;
            isValid = true;

            this.Reject(value === 0, idThongBao, noiDungThongBao)
            return isValid;
        },



        Reject: function(statement, idThongBao, noiDungThongBao) {
            if (statement) {
                isValid = false;
                document.getElementById(idThongBao).innerHTML = noiDungThongBao;
                document.getElementById(idThongBao).style.display = 'block';
            } else {
                document.getElementById(idThongBao).innerHTML = '';
            }
        }
    }
};