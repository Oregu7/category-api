export function isObjectDefined(obj: any): boolean {
	return obj !== undefined && typeof(obj) === 'object' && obj !== null && (obj instanceof Date) === false && Array.isArray(obj) === false;
}

// -------------------------------------------------------

export function deleteFields<T>(dto: Record<string, any>, fields: (keyof T)[]) {
	for (const field of fields) {
		delete dto[field as any];
	}

	return dto;
}

// -------------------------------------------------------

export function deleteAllFieldsExcept<T>(dto: Record<string, any>, fields: (keyof T)[]) {
	for (const key of Object.keys(dto)) {
		if (fields.includes(key as any) === false) {
			delete dto[key];
		}
	}

	return dto;
}

// -------------------------------------------------------
