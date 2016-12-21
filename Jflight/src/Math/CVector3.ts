

//
// CVector3
// ３次ベクトルクラス
//
// ガーベッジコレクションを避けるため、新規オブジェクト生成が必要となる
// 和や差を求めるメソッドを持たせてないので注意。
// 効率と利便性を重視して、メンバ変数もpublicにしてある
//

class CVector3 {

    // 変数

    // public x: number;
    // public y: number;
    // public z: number;

    // コンストラクタ
    public constructor(public x = 0, public y = 0, public z = 0) {
        //this.set(ax, ay, az);
    }

    // 値設定

    public set(x: number, y: number, z: number) {
        this.x = x;
        this.y = y;
        this.z = z;
        return this;
    }

    // ベクトル加算

    public add(a: CVector3) {
        this.x += a.x;
        this.y += a.y;
        this.z += a.z;
        return this;
    }

    public setPlus(a: CVector3, b: CVector3) {
        this.x = a.x + b.x;
        this.y = a.y + b.y;
        this.z = a.z + b.z;
        return this;
    }

    // ベクトル定数倍加算

    public addCons(a: CVector3, c: number) {
        this.x += a.x * c;
        this.y += a.y * c;
        this.z += a.z * c;
        return this;
    }

    // ベクトル減算

    public sub(a: CVector3) {
        this.x -= a.x;
        this.y -= a.y;
        this.z -= a.z;
        return this;
    }

    public setMinus(a: CVector3, b: CVector3) {
        this.x = a.x - b.x;
        this.y = a.y - b.y;
        this.z = a.z - b.z;
        return this;
    }

    // ベクトル定数倍減算
    public subCons(a: CVector3, c: number) {
        this.x -= a.x * c;
        this.y -= a.y * c;
        this.z -= a.z * c;
        return this;
    }

    // 定数倍

    public cons(c: number) {
        this.x *= c;
        this.y *= c;
        this.z *= c;
        return this;
    }

    public consInv(c: number) {
        this.x /= c;
        this.y /= c;
        this.z /= c;
        return this;
    }

    public setCons(a: CVector3, c: number) {
        this.x = a.x * c;
        this.y = a.y * c;
        this.z = a.z * c;
        return this;
    }

    public setConsInv(a: CVector3, c: number) {
        this.x = a.x / c;
        this.y = a.y / c;
        this.z = a.z / c;
        return this;
    }

    // ベクトル長の２乗

    public abs2() {
        return this.x * this.x + this.y * this.y + this.z * this.z;
    }

    // ベクトル長

    public abs() {
        return Math.sqrt(this.abs2());
    }

    // 内積

    public inprod(a: CVector3) {
        return this.x * a.x + this.y * a.y + this.z * a.z;
    }
}

