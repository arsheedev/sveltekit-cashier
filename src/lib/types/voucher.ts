export interface Voucher {
	id: number;
	code: string;
	type: string;
	discountValue?: number;
	description: string;
	pointsRequired: number;
}
