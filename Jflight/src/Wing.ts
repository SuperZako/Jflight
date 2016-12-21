//
// Wing
// 翼クラス
//
// 翼についたエンジンも表す
//

class Wing extends PhysicsState {

    //        座標系
    //     Z
    //     ^  Y
    //     | /
    //     |/
    //     -------->X

    // 変数
    // public pVel: CVector3;    // 翼中心位置（機体座標）

    public unitX = new CVector3();   // 翼座標Ｘ単位ベクトル（機体座標）
    public yVel = new CVector3();   // 翼座標Ｙ単位ベクトル（機体座標）
    public zVel = new CVector3();   // 翼座標Ｚ単位ベクトル（機体座標）
    public mass: number;      // 翼の質量
    public sVal: number;      // 翼面積
    public fVel: CVector3;    // 翼にかかっている力
    public aAngle: number;    // 翼のＸ軸ひねり角度（rad）
    public bAngle: number;    // 翼のＹ軸ひねり角度（rad）

    // public forward: CVector3;    // 翼のひねりを考慮したＹ単位ベクトル（機体座標）

    public tVal: number;      // エンジンの推力（0で通常の翼）

    // テンポラリオブジェクト

    protected m_pp: CVector3; protected m_op: CVector3; protected m_ti: CVector3; protected m_ni: CVector3; protected m_vp: CVector3; protected m_vp2: CVector3;
    protected m_wx: CVector3; protected m_wy: CVector3; protected m_wz: CVector3;

    protected m_qx: CVector3; protected m_qy: CVector3; protected m_qz: CVector3;

    // コンストラクタ

    public constructor() {
        super();

        this.fVel = new CVector3();

        this.m_pp = new CVector3();
        this.m_op = new CVector3();
        this.m_ti = new CVector3();
        this.m_ni = new CVector3();
        this.m_vp = new CVector3();
        this.m_vp2 = new CVector3();
        this.m_wx = new CVector3();
        this.m_wy = new CVector3();
        this.m_wz = new CVector3();
        this.m_qx = new CVector3();
        this.m_qy = new CVector3();
        this.m_qz = new CVector3();
    }

    // 翼計算を行う
    // fVelに計算結果が求まる
    // veは空気密度、noは翼No.（迎角計算に使用）、boostはエンジンブースト

    public calc(plane: Plane, ve: number, no: number, boost: boolean) {
        let n, at, rr, cl, cd, ff;

        // 機体の速度と回転率、翼の位置から翼における速度を求める（外積計算）
        this.m_vp.x = plane.localVelocity.x + this.position.y * plane.vaVel.z - this.position.z * plane.vaVel.y;
        this.m_vp.y = plane.localVelocity.y + this.position.z * plane.vaVel.x - this.position.x * plane.vaVel.z;
        this.m_vp.z = plane.localVelocity.z + this.position.x * plane.vaVel.y - this.position.y * plane.vaVel.x;


        // 翼のひねりを基に、基本座標ベクトルを回転

        let sin = Math.sin(this.bAngle);
        let cos = Math.cos(this.bAngle);

        this.m_qx.x = this.unitX.x * cos - this.zVel.x * sin;
        this.m_qx.y = this.unitX.y * cos - this.zVel.y * sin;
        this.m_qx.z = this.unitX.z * cos - this.zVel.z * sin;

        this.m_qy.set(this.yVel.x, this.yVel.y, this.yVel.z);

        this.m_qz.x = this.unitX.x * sin + this.zVel.x * cos;
        this.m_qz.y = this.unitX.y * sin + this.zVel.y * cos;
        this.m_qz.z = this.unitX.z * sin + this.zVel.z * cos;

        sin = Math.sin(this.aAngle);
        cos = Math.cos(this.aAngle);

        this.m_wx.set(this.m_qx.x, this.m_qx.y, this.m_qx.z);

        this.m_wy.x = this.m_qy.x * cos - this.m_qz.x * sin;
        this.m_wy.y = this.m_qy.y * cos - this.m_qz.y * sin;
        this.m_wy.z = this.m_qy.z * cos - this.m_qz.z * sin;

        this.m_wz.x = this.m_qy.x * sin + this.m_qz.x * cos;
        this.m_wz.y = this.m_qy.y * sin + this.m_qz.y * cos;
        this.m_wz.z = this.m_qy.z * sin + this.m_qz.z * cos;

        let t0 = 0;

        this.fVel.set(0, 0, 0);

        if (this.sVal > 0) {

            // 翼計算

            let vv = this.m_vp.abs();

            // 翼速度の単位ベクトルを求める(機体座標)

            this.m_ti.x = this.m_vp.x / vv;
            this.m_ti.y = this.m_vp.y / vv;
            this.m_ti.z = this.m_vp.z / vv;

            // 機体座標の翼速度を翼座標系に変換

            let dx = this.m_wx.x * this.m_vp.x + this.m_wx.y * this.m_vp.y + this.m_wx.z * this.m_vp.z;
            let dy = this.m_wy.x * this.m_vp.x + this.m_wy.y * this.m_vp.y + this.m_wy.z * this.m_vp.z;
            let dz = this.m_wz.x * this.m_vp.x + this.m_wz.y * this.m_vp.y + this.m_wz.z * this.m_vp.z;

            // 揚力方向の速度成分を求める

            rr = Math.sqrt(dx * dx + dy * dy);

            if (rr > 0.001) {
                this.m_vp2.x = (this.m_wx.x * dx + this.m_wy.x * dy) / rr;
                this.m_vp2.y = (this.m_wx.y * dx + this.m_wy.y * dy) / rr;
                this.m_vp2.z = (this.m_wx.z * dx + this.m_wy.z * dy) / rr;
            }
            else {
                this.m_vp2.x = this.m_wx.x * dx + this.m_wy.x * dy;
                this.m_vp2.y = this.m_wx.y * dx + this.m_wy.y * dy;
                this.m_vp2.z = this.m_wx.z * dx + this.m_wy.z * dy;
            }

            this.m_ni.x = this.m_wz.x * rr - this.m_vp2.x * dz;
            this.m_ni.y = this.m_wz.y * rr - this.m_vp2.y * dz;
            this.m_ni.z = this.m_wz.z * rr - this.m_vp2.z * dz;

            vv = this.m_ni.abs();

            this.m_ni.consInv(vv);

            // 迎角を求める

            at = -Math.atan(dz / dy);

            if (no === 0)
                plane.aoa = at;

            if (Math.abs(at) < 0.4) {
                //  揚力係数と抗力係数を迎角から求める
                cl = at * 4;
                cd = (at * at + 0.05);
            }
            else {
                //  迎角が0.4radを超えていたら失速
                cl = 0;
                cd = (0.4 * 0.4 + 0.05);
            }

            // 抗力を求める
            t0 = 0.5 * vv * vv * cd * ve * this.sVal;

            // 揚力を求める
            n = 0.5 * rr * rr * cl * ve * this.sVal;

            this.fVel.x = n * this.m_ni.x - t0 * this.m_ti.x;
            this.fVel.y = n * this.m_ni.y - t0 * this.m_ti.y;
            this.fVel.z = n * this.m_ni.z - t0 * this.m_ti.z;
        }

        if (this.tVal > 0) {

            // 推力計算

            // 推力を求める
            if (boost)
                ff = ((5 * 10) / 0.9) * ve * 4.8 * this.tVal;
            else
                ff = (plane.power / 0.9) * ve * 4.8 * this.tVal;

            // 地面に近い場合、見かけの推力を上げる
            if (plane.height < 20)
                ff *= (1 + (20 - plane.height) / 40);

            // 推力を加える

            this.fVel.addCons(this.m_wy, ff);
        }
        // this.forward.set(this.m_wy.x, this.m_wy.y, this.m_wy.z);
    }

}