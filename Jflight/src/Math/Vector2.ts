

class Vector2 {
    public constructor(public x = 0, public y = 0) { }


    public multiply(scalar: number) {
        return new Vector2(this.x * scalar, this.y * scalar);
    }
}