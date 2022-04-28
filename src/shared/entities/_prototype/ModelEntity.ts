import {
  deleteAllFieldsExcept,
  deleteFields,
  isObjectDefined,
} from '../../utils/helpers';

// =======================================================

export class ModelEntity {
  static $relations: string[] = [];

  // ----------------------------
  // System properties
  // ----------------------------

  $isCreated = false;
  $isChanged = false;

  // ----------------------------
  // Static Methods
  // ----------------------------

  static createFrom<T extends ModelEntity>(
    this: (new () => T) & typeof ModelEntity,
    dto: Partial<{ [K in keyof T]?: any }>,
  ): T {
    const instance = new this();

    for (const key of Object.keys(dto) as (keyof T)[]) {
      instance[key] = dto[key];
    }

    instance.$isCreated = true;

    return instance;
  }

  static $dto<T extends ModelEntity>(
    instance: (new () => T) & typeof ModelEntity,
  ): Record<string, any> {
    const dto: Record<string, any> = {};

    for (const key of Object.keys(instance)) {
      let prop = (instance as any)[key];

      if (
        typeof prop === 'function' ||
        key.startsWith('$') ||
        key.startsWith('_')
      ) {
        continue;
      }

      if (isObjectDefined(prop)) {
        if ('$dto' in prop) {
          dto[key] = prop.$dto;
        } else {
          dto[key] = Object.assign({}, prop);
        }
      } else {
        if (prop instanceof Date) {
          prop = prop.toISOString();
        }
        dto[key] = prop !== null ? prop : undefined;
      }
    }

    return dto;
  }

  static deleteFields<T extends ModelEntity>(
    this: (new () => T) & typeof ModelEntity,
    dto: Record<string, any>,
    fields: (keyof T)[],
  ) {
    return deleteFields(dto, fields as any);
  }

  static deleteAllFieldsExcept<T extends ModelEntity>(
    this: (new () => T) & typeof ModelEntity,
    dto: Record<string, any>,
    fields: (keyof T)[],
  ) {
    return deleteAllFieldsExcept(dto, fields as any);
  }

  // ----------------------------
  // Instance Methods
  // ----------------------------

  apply(patch: Record<string, any>) {
    const instance = this as any;

    // eslint-disable-next-line prefer-const
    for (let [key, item] of Object.entries(patch)) {
      if (instance.hasOwnProperty(key) === false || item === undefined) {
        continue;
      }

      switch (typeof item) {
        case 'string':
        case 'number':
        case 'boolean': {
          if (instance[key] === item) {
            continue;
          }

          break;
        }

        case 'object': {
          if (
            item instanceof Date &&
            instance[key] &&
            instance[key].toISOString() === item.toISOString()
          ) {
            continue;
          }

          if (item === null && instance[key] === item) {
            continue;
          }

          // merge object values
          if (Array.isArray(item) === false && item !== null) {
            const newObj = instance[key] ? { ...instance[key] } : {};

            const itemKeys = Object.keys(item);

            if (itemKeys.length === 0) {
              continue;
            }

            for (const itemKey of itemKeys) {
              if (item[itemKey] === null) {
                delete newObj[itemKey];
              } else {
                newObj[itemKey] = item[itemKey];
              }
            }

            item = newObj;
          }

          break;
        }
      }

      instance[key] = item;
      this.$isChanged = true;
    }
  }

  // ---------------------------------------------

  deleteFields(dto: Record<string, any>, fields: (keyof this)[]) {
    return ModelEntity.deleteFields(dto, fields as any[]);
  }

  deleteAllFieldsExcept(dto: Record<string, any>, fields: (keyof this)[]) {
    return ModelEntity.deleteAllFieldsExcept(dto, fields as any[]);
  }

  // ---------------------------------------------

  get $dto() {
    const Self = this.constructor as any;
    return Self.$dto(this);
  }
}
