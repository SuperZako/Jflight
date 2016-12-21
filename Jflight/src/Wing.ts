//
// Wing
// ���N���X
//
// ���ɂ����G���W�����\��
//

class Wing extends PhysicsState {

    //        ���W�n
    //     Z
    //     ^  Y
    //     | /
    //     |/
    //     -------->X

    // �ϐ�
    // public pVel: CVector3;    // �����S�ʒu�i�@�̍��W�j

    public unitX = new THREE.Vector3();   // �����W�w�P�ʃx�N�g���i�@�̍��W�j
    public yVel = new THREE.Vector3();   // �����W�x�P�ʃx�N�g���i�@�̍��W�j
    public zVel = new THREE.Vector3();   // �����W�y�P�ʃx�N�g���i�@�̍��W�j
    public mass: number;      // ���̎���
    public sVal: number;      // ���ʐ�
    public fVel = new THREE.Vector3();    // ���ɂ������Ă����
    public aAngle: number;    // ���̂w���Ђ˂�p�x�irad�j
    public bAngle: number;    // ���̂x���Ђ˂�p�x�irad�j

    // public forward: CVector3;    // ���̂Ђ˂���l�������x�P�ʃx�N�g���i�@�̍��W�j

    public tVal: number;      // �G���W���̐��́i0�Œʏ�̗��j

    // �e���|�����I�u�W�F�N�g
    // protected m_op: CVector3;
    // protected m_ti: CVector3;
    // protected m_ni: CVector3;
    // protected m_vp: CVector3;
    // protected m_vp2: CVector3;

    // protected m_wx: CVector3;
    // protected m_wy: CVector3;
    protected m_wz: CVector3;

    protected m_qx: CVector3;
    protected m_qy: CVector3;
    protected m_qz: CVector3;

    // �R���X�g���N�^

    public constructor() {
        super();

        // this.m_ti = new CVector3();
        // this.m_ni = new CVector3();
        // this.m_vp = new CVector3();
        // this.m_vp2 = new CVector3();
        // this.m_wx = new CVector3();
        // this.m_wy = new CVector3();
        this.m_wz = new CVector3();
        this.m_qx = new CVector3();
        this.m_qy = new CVector3();
        this.m_qz = new CVector3();
    }

    // ���v�Z���s��
    // fVel�Ɍv�Z���ʂ����܂�
    // ve�͋�C���x�Ano�͗�No.�i�}�p�v�Z�Ɏg�p�j�Aboost�̓G���W���u�[�X�g

    public calc(plane: Plane, ve: number, no: number, boost: boolean) {
        let cl, cd, ff;

        // �@�̂̑��x�Ɖ�]���A���̈ʒu���痃�ɂ����鑬�x�����߂�i�O�όv�Z�j
        let vp = new THREE.Vector3();
        vp.x = plane.localVelocity.x + this.position.y * plane.vaVel.z - this.position.z * plane.vaVel.y;
        vp.y = plane.localVelocity.y + this.position.z * plane.vaVel.x - this.position.x * plane.vaVel.z;
        vp.z = plane.localVelocity.z + this.position.x * plane.vaVel.y - this.position.y * plane.vaVel.x;


        // ���̂Ђ˂����ɁA��{���W�x�N�g������]

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


        // this.m_wx.set(this.m_qx.x, this.m_qx.y, this.m_qx.z);
        let wx = new THREE.Vector3();
        wx.copy(<any>this.m_qx);

        let wy = new THREE.Vector3();
        wy.x = this.m_qy.x * cos - this.m_qz.x * sin;
        wy.y = this.m_qy.y * cos - this.m_qz.y * sin;
        wy.z = this.m_qy.z * cos - this.m_qz.z * sin;

        this.m_wz.x = this.m_qy.x * sin + this.m_qz.x * cos;
        this.m_wz.y = this.m_qy.y * sin + this.m_qz.y * cos;
        this.m_wz.z = this.m_qy.z * sin + this.m_qz.z * cos;

        let t0 = 0;

        this.fVel.set(0, 0, 0);

        if (this.sVal > 0) {

            // ���v�Z

            // let vv = this.m_vp.abs();

            // �����x�̒P�ʃx�N�g�������߂�(�@�̍��W)
            // this.m_ti.x = this.m_vp.x / vv;
            // this.m_ti.y = this.m_vp.y / vv;
            // this.m_ti.z = this.m_vp.z / vv;

            let ti = new THREE.Vector3();
            ti.copy(vp);
            ti.normalize();

            // �@�̍��W�̗����x�𗃍��W�n�ɕϊ�

            // let dx = wx.x * vp.x + wx.y * vp.y + wx.z * vp.z;
            let dx = wx.dot(vp);
            let dy = wy.x * vp.x + wy.y * vp.y + wy.z * vp.z;
            let dz = this.m_wz.x * vp.x + this.m_wz.y * vp.y + this.m_wz.z * vp.z;

            // �g�͕����̑��x���������߂�

            let rr = Math.sqrt(dx * dx + dy * dy);

            let vp2 = new THREE.Vector3();
            if (rr > 0.001) {
                vp2.x = (wx.x * dx + wy.x * dy) / rr;
                vp2.y = (wx.y * dx + wy.y * dy) / rr;
                vp2.z = (wx.z * dx + wy.z * dy) / rr;
            }
            else {
                vp2.x = wx.x * dx + wy.x * dy;
                vp2.y = wx.y * dx + wy.y * dy;
                vp2.z = wx.z * dx + wy.z * dy;
            }

            let ni = new THREE.Vector3();
            ni.x = this.m_wz.x * rr - vp2.x * dz;
            ni.y = this.m_wz.y * rr - vp2.y * dz;
            ni.z = this.m_wz.z * rr - vp2.z * dz;

            // vv = this.m_ni.abs();
            // this.m_ni.consInv(vv);
            let vv = ni.length();
            ni.normalize();

            // �}�p�����߂�

            let at = -Math.atan(dz / dy);

            if (no === 0) {
                plane.aoa = at;
            }

            if (Math.abs(at) < 0.4) {
                //  �g�͌W���ƍR�͌W�����}�p���狁�߂�
                cl = at * 4;
                cd = (at * at + 0.05);
            }
            else {
                //  �}�p��0.4rad�𒴂��Ă����玸��
                cl = 0;
                cd = (0.4 * 0.4 + 0.05);
            }

            // �R�͂����߂�
            t0 = 0.5 * vv * vv * cd * ve * this.sVal;

            // �g�͂����߂�
            let n = 0.5 * rr * rr * cl * ve * this.sVal;

            this.fVel.x = n * ni.x - t0 * ti.x;
            this.fVel.y = n * ni.y - t0 * ti.y;
            this.fVel.z = n * ni.z - t0 * ti.z;
        }

        if (this.tVal > 0) {

            // ���͌v�Z

            // ���͂����߂�
            if (boost) {
                ff = ((5 * 10) / 0.9) * ve * 4.8 * this.tVal;
            } else {
                ff = (plane.power / 0.9) * ve * 4.8 * this.tVal;
            }

            // �n�ʂɋ߂��ꍇ�A�������̐��͂��グ��
            if (plane.height < 20)
                ff *= (1 + (20 - plane.height) / 40);

            // ���͂�������

            // this.fVel.addCons(this.m_wy, ff);
            this.fVel.addScaledVector(wy, ff);
        }
        // this.forward.set(this.m_wy.x, this.m_wy.y, this.m_wy.z);
    }

}