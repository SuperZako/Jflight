///<reference path="./Math/CVector3.ts" />

//
// Bullet
// �e�ۃN���X
//

class Bullet extends PhysicsState {

    // �ϐ�

    // public pVel = new CVector3();         // �ʒu
    // public vVel = new CVector3();         // ���x

    public oldPosition = new CVector3();     // �P�X�e�b�v�O�̈ʒu

    public use = 0;               // �g�p��ԁi0�Ŗ��g�p�j
    public bom = 0;               // ������ԁi0�Ŗ����j

    // �e���|�����p�I�u�W�F�N�g

    protected m_a = new CVector3();
    protected m_b = new CVector3();
    protected m_vv = new CVector3();

    private sphere: THREE.Mesh;
    // �R���X�g���N�^

    public constructor(scene: THREE.Scene) {
        super();
        var geometry = new THREE.SphereGeometry(5, 8, 8);
        var material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
        this.sphere = new THREE.Mesh(geometry, material);
        this.sphere.visible = false;
        scene.add(this.sphere);
    }

    // �e�ۈړ��A�G�@�Ƃ̂����蔻��A�n�ʂƂ̓����蔻����s��
    // �e�۔��ˏ�����Jflight�N���X���ōs���Ă���

    public move(world: Jflight, plane: Plane) {

        // �d�͉���
        this.velocity.z += Jflight.G * Jflight.DT;

        // ��O�̈ʒu��ۑ�
        this.oldPosition.set(this.position.x, this.position.y, this.position.z);

        // �ړ�
        // this.position.addCons(this.velocity, Jflight.DT);
        this.position.addScaledVector(<any>this.velocity, Jflight.DT);
        this.use--;

        // �e�ۂ��ړ�������
        if (this.use > 0) {
            this.sphere.position.x = this.position.x;
            this.sphere.position.y = this.position.y;
            this.sphere.position.z = this.position.z;
            this.sphere.visible = true;
        } else {
            this.sphere.visible = false;
        }

        // �e�ۂ��������̏ꍇ�A���~�\��
        if (this.bom > 0) {
            // this.change3d(this.plane[0], bp.opVel, cp);
            // this.fillBarc(cp);
            this.bom--;
        }
        // �ڕW����܂��Ă���̂Ȃ�^�[�Q�b�g�Ƃ̓����蔻����s��
        // �ڕW�ȊO�Ƃ̓����蔻��͍s��Ȃ�

        if (plane.gunTarget > -1) {

            // �ڕW�����݂��Ă���ꍇ

            // �����ł̓����蔻����@�́A
            // ��O�̈ʒu�ƌ��݂̈ʒu�Ƃ̋�����
            // ��O�̈ʒu�ƖڕW�̋����A���݂̈ʒu�ƖڕW�̋����Ƃ̘a���r���邱�Ƃ�
            // �s���Ă���B�e�ۑ��x���������߁A�P�ɋ��������߂Ă�������Ȃ��B
            // �_�ƒ����̕������ōĐڋߋ��������߂Ă��ǂ����A�ʓ|�������̂Ŏ蔲�� �B

            // ���݂̒e�ۂ̈ʒu�ƖڕW�Ƃ̍��x�N�g�������߂�
            this.m_a.setMinus(<any>this.position, <any>world.plane[plane.gunTarget].position);

            // ��O�̒e�ۂ̈ʒu�ƖڕW�Ƃ̍��x�N�g�������߂�
            this.m_b.setMinus(this.oldPosition, <any>world.plane[plane.gunTarget].position);

            // ��O�̒e�ۂ̈ʒu�ƌ��݂̒e�ۂ̈ʒu�Ƃ̍��x�N�g�������߂�
            this.m_vv.setCons(this.velocity, Jflight.DT);

            let v0 = this.m_vv.abs();
            let l = this.m_a.abs() + this.m_b.abs();

            if (l < v0 * 1.05) {
                // ����
                this.bom = 1;  // �����\���p�ɃZ�b�g
                this.use = 10; // �����ɂ͏����Ȃ��Œ��˔�΂�

                // ���݈ʒu�ƈ�O�̈ʒu�̒��Ԉʒu�����̑��x�����𑫂��Ē��˔�΂�
                this.m_vv.x = (this.m_a.x + this.m_b.x) / 2.0;
                this.m_vv.y = (this.m_a.y + this.m_b.y) / 2.0;
                this.m_vv.z = (this.m_a.z + this.m_b.z) / 2.0;
                l = this.m_vv.abs();
                this.m_vv.consInv(l);
                this.velocity.addCons(this.m_vv, v0 / 0.1);
                this.velocity.cons(0.1);
            }
        }

        // �n�ʂƂ̓����蔻��

        let gh = world.gHeight(this.position.x, this.position.y);
        if (this.position.z < gh) {
            // �n�ʈȉ��Ȃ�A�����˂�����
            this.velocity.z = Math.abs(this.velocity.z);
            this.position.z = gh;
            this.velocity.x += (Math.random() - 0.5) * 50;
            this.velocity.y += (Math.random() - 0.5) * 50;
            this.velocity.x *= 0.5;
            this.velocity.y *= 0.5;
            this.velocity.z *= 0.1;
        }
    }
}