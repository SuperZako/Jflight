﻿///<reference path="../Math/CVector3.ts" />

class PhysicsState {
    public position = new THREE.Vector3();//new CVector3();    // 位置（ワールド座標系）
    public velocity = new CVector3();    // 速度（ワールド座標系）

    public rotation = new THREE.Euler(); //

    public constructor() {
    }
}