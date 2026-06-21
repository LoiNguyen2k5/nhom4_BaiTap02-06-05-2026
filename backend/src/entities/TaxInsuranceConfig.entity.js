class TaxInsuranceConfigEntity {
  static tableName = 'tax_insurance_configs';

  static fields = {
    id:                          { type: 'INT', pk: true, autoIncrement: true },
    social_insurance_rate:       { type: 'FLOAT', nullable: false, default: 8.0 },
    health_insurance_rate:       { type: 'FLOAT', nullable: false, default: 1.5 },
    unemployment_insurance_rate: { type: 'FLOAT', nullable: false, default: 1.0 },
    base_salary:                 { type: 'DECIMAL(15,2)', nullable: false, default: 2340000.00 },
    max_insurance_salary:        { type: 'DECIMAL(15,2)', nullable: false, default: 46800000.00 },
    personal_deduction:          { type: 'DECIMAL(15,2)', nullable: false, default: 11000000.00 },
    dependent_deduction:         { type: 'DECIMAL(15,2)', nullable: false, default: 4400000.00 },
    updated_at:                  { type: 'DATETIME' },
  };

  static relations = [];

  constructor(data = {}) {
    this.id                          = data.id                          ?? null;
    this.social_insurance_rate       = data.social_insurance_rate       ?? 8.0;
    this.health_insurance_rate       = data.health_insurance_rate       ?? 1.5;
    this.unemployment_insurance_rate = data.unemployment_insurance_rate ?? 1.0;
    this.base_salary                 = data.base_salary                 ?? 2340000;
    this.max_insurance_salary        = data.max_insurance_salary        ?? 46800000;
    this.personal_deduction          = data.personal_deduction          ?? 11000000;
    this.dependent_deduction         = data.dependent_deduction         ?? 4400000;
    this.updated_at                  = data.updated_at                  ?? null;
  }

  get total_employee_insurance_rate() {
    return this.social_insurance_rate + this.health_insurance_rate + this.unemployment_insurance_rate;
  }

  toJSON() { return { ...this, total_employee_insurance_rate: this.total_employee_insurance_rate }; }
}

module.exports = TaxInsuranceConfigEntity;
