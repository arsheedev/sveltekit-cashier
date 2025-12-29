function formParser<const T extends readonly string[]>(
	formNames: T,
	formData: FormData
): { [K in T[number]]: FormDataEntryValue | null } {
	const parsedForm = {} as { [K in T[number]]: FormDataEntryValue | null };

	for (const name of formNames) {
		parsedForm[name as T[number]] = formData.get(name);
	}

	return parsedForm;
}

export default formParser;
