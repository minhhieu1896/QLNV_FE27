var modelController = (function () {

    var mangNV = [];

    function NhanVien(msNV, tenNV, email, matKhau, ngaySinh, chucVu) {
        this.msNV = msNV;
        this.tenNV = tenNV;
        this.email = email;
        this.matKhau = matKhau;
        this.ngaySinh = ngaySinh;
        this.chucVu = chucVu;
        this.luongCB = 400;     // Tổng lương = lương cơ bản nhân hệ số lương;
        this.tongLuong = this.tinhTongLuong();
    };

    NhanVien.prototype.tinhTongLuong = function() {
        if ( this.chucVu === "Sếp") { return this.luongCB * 3; }
        else if ( this.chucVu === "Trưởng phòng") { return this.luongCB * 1.5; }
        else if ( this.chucVu === "Nhân viên") { return this.luongCB; }
    };

    return {

        themNhanVien: function(obj) {
            var nhanVien = new NhanVien(obj.msNV, obj.tenNV, obj.email, obj.matKhau, obj.ngaySinh, obj.chucVu);
            mangNV.push(nhanVien);
            console.table(nhanVien);
            console.table(mangNV);
        },

        GetMangNV: function(){
            return mangNV;
        },

        TimKiemNhanVienTheoTen: function(name) {

        }

    }

})();


// -------------------View Controller ----------------------

var viewController = (function () {

    return {

        layThongTin: function() {
            return {
                msNV: document.getElementById('msnv').value,
                tenNV: document.getElementById('name').value,
                email: document.getElementById('email').value,
                matKhau: document.getElementById('password').value,
                ngaySinh: document.getElementById('datepicker').value,
                chucVu: document.getElementById('chucvu').value
            }
        },

        HienThi: function(mangNV) {
            var tableDS = document.getElementById('tableDanhSach');
            var content = '';
            for (var i = 0; i < mangNV.length; i++) {
                var nv = mangNV[i];
                content += 
                `<tr>
                    <td>${nv.msNV}</td>
                    <td>${nv.tenNV}</td>
                    <td>${nv.email}</td>
                    <td>${nv.ngaySinh}</td>
                    <td>${nv.chucVu}</td>
                    <td>${nv.tongLuong}</td>
                    <td id="detail-update-btn">
                        <button class="btn btn-danger btn-xoaNhanVien" data-id='${nv.msNV}'>Xóa</button>
                        <button class="btn btn-info" data-toggle="modal"
                        data-target="#myModal" data-id='${nv.msNV}'>Sửa</button>
                    </td>
                </tr>`
            }
            tableDS.innerHTML = content;
        },

        HienThiThongTinLenForm: function(nhanVien) {
            document.getElementById('msnv').value = nhanVien.msNV;
            document.getElementById('name').value = nhanVien.tenNV;
            document.getElementById('email').value = nhanVien.email;
            document.getElementById('password').value = nhanVien.matKhau;
            document.getElementById('datepicker').value = nhanVien.ngaySinh;
            document.getElementById('chucvu').value = nhanVien.chucVu;
        }


    }

})();

// validation
var isValid = Validation();


// ------------------- Controller ----------------------

var Controller = (function (model, view) {

    var mangNV = JSON.parse(localStorage.getItem('DSNV'));
    mangNV = mangNV.sort(function(a,b) { 
        return b.tongLuong - a.tongLuong;
    })

    var setupEventListeners = function() {

        document.getElementById('btnThemNV').addEventListener('click', ThemNV);
        document.getElementById('btnLuuDuLieu').addEventListener('click', LuuDuLieu);
        document.getElementById('btnLayDuLieu').addEventListener('click', LayDuLieu);
        document.getElementById('tableDanhSach').addEventListener('click', RemoveOrUpdate);
        document.getElementById('btnCapNhat').addEventListener('click', ChinhSuaThongTin.CapNhatDuLieu);
        document.getElementById('btnTimNV').addEventListener('click', TimNhanVien);
        document.getElementById('searchName').addEventListener('keyup', TimNhanVien);
        // window.addEventListener('keyup', TimNhanVien);
        // document.getElementById('btnTimNV').addEventListener('keypress', TimNhanVien);
        // var btnXoaArr = Array.from(document.getElementsByClassName('btn-xoaNhanVien'))
        // btnXoaArr.forEach( function(curr) {
        //     curr.addEventListener('click', XoaNhanVien);
        // });

        //isMode = ""

        var btnXoaArr = document.querySelectorAll('.btn-xoaNhanVien');
        for( var i = 0; i < btnXoaArr.length; i++ ){
            btnXoaArr[i].addEventListener('click', alert);
        }
        // document.getElementById('tableDanhSach').addEventListener('click', XoaNhanVien);
        
    }

    function ThemNV (){
        var obj;
        obj = view.layThongTin();

        if(isValid.KiemTraRong('msnv', "tbMaNV", 'chưa nhập msnv !!!')) {
            model.themNhanVien(obj);
    
            view.HienThi(model.GetMangNV());
        }
    }

    function LuuDuLieu() { //vao LocalStorage
        var mangNV = model.GetMangNV();
        // chuyển dữ liệu mảng nhân  viên qua Json
        var jsonData = JSON.stringify(mangNV);
        // Luuw vào localStorage
        localStorage.setItem("DSNV", jsonData);
    }

    function LayDuLieu() {
        var data = JSON.parse(localStorage.getItem('DSNV'));

        data = data.sort(function(a,b) { 
            return b.tongLuong - a.tongLuong;
        })

        view.HienThi(data);
    }

    function RemoveOrUpdate() {
        var eventTarget = window.event.target;
        var target = event.target.classList.toString();
        if (target.includes('btn-danger')) {
            XoaNhanVien(eventTarget);
        } else if (target.includes('btn-info')) {
            ChinhSuaThongTin.HienThiThongTin(eventTarget);
        }
        else{console.log(':)')};
    }

    function XoaNhanVien(eventTarget) {
        var btnXoa = eventTarget;
        console.log(event.target.classList.toString());
        window.myTarget = event.target.classList.toString();
        var idXoa = btnXoa.getAttribute("data-id");

        var indexIdXoa = TimIndex(idXoa);

        if(indexIdXoa !== -1) {

            mangNV.splice(indexIdXoa, 1);
            view.HienThi(mangNV);
        }
    }

    var ChinhSuaThongTin = (function() {
        var btnSua, IdSua, indexIdSua, nhanVien;
        
        return {
            HienThiThongTin: function(eventTarget){
                btnSua = eventTarget;
                IdSua = btnSua.getAttribute("data-id");
                indexIdSua = TimIndex(IdSua);
                nhanVien = mangNV[indexIdSua];
                view.HienThiThongTinLenForm(nhanVien);
            },

            CapNhatDuLieu: function(){
                nhanVien = view.layThongTin();
                mangNV[indexIdSua] = nhanVien;
                view.HienThi(mangNV);
            }
        }
    }) ();

    function TimIndex(idCanTim) {
        var mangID = mangNV.map( function(curr) {
            return curr.msNV;
        });

        var index = mangID.indexOf(idCanTim);
        return index
    };

    function TimNhanVien() {
        var keyword = document.getElementById('searchName').value;
        keyword = convertText(keyword);
        
        var nameArr = mangNV.filter( function (curr) {
            return convertText(curr.tenNV).includes(keyword);
        })

        view.HienThi(nameArr);
    };

    function convertText(str) {
        str = str.toLowerCase();
        str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
        str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
        str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
        str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
        str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
        str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
        str = str.replace(/đ/g, "d");
        // Some system encode vietnamese combining accent as individual utf-8 characters
        str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // Huyền sắc hỏi ngã nặng 
        str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // Â, Ê, Ă, Ơ, Ư
        return str;
    };

    function testGithub() {
        console.log("hello github");
    }

    return {
        init: function (){
            console.log('App has started!');
            setupEventListeners();
            LayDuLieu();
        },
    }

})( modelController, viewController );

Controller.init();
