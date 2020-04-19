from sqlalchemy.orm import relationship

from app import db


class ModelParams(db.Model):
    __tablename__ = 'model_params'

    id = db.Column(db.Integer, primary_key=True)
    model = db.Column(db.String())
    population = db.Column(db.Integer)
    kpe = db.Column(db.Integer)
    kem = db.Column(db.Integer)
    kmg = db.Column(db.Integer)
    kmh = db.Column(db.Integer)
    khr = db.Column(db.Integer)
    khg = db.Column(db.Integer)
    krd = db.Column(db.Integer)
    krg = db.Column(db.Integer)
    tem = db.Column(db.Integer)
    tmg = db.Column(db.Integer)
    tmh = db.Column(db.Integer)
    thg = db.Column(db.Integer)
    thr = db.Column(db.Integer)
    trsr = db.Column(db.Integer)
    lim_time = db.Column(db.Integer)
    user_id = db.Column(db.Integer)

    def __init__(
            self,
            model,
            population,
            kpe,
            kem,
            kmg,
            kmh,
            khr,
            khg,
            krd,
            krg,
            tem,
            tmg,
            tmh,
            thg,
            thr,
            trsr,
            lim_time,
            user_id
    ):
        self.model = model
        self.population = population
        self.kpe = kpe
        self.kem = kem
        self.kmg = kmg
        self.kmh = kmh
        self.khr = khr
        self.khg = khg
        self.krd = krd
        self.krg = krg
        self.tem = tem
        self.tmg = tmg
        self.tmh = tmh
        self.thg = thg
        self.thr = thr
        self.trsr = trsr
        self.lim_time = lim_time
        self.user_id = user_id

    def __repr__(self):
        return '<id {}>'.format(self.id)
