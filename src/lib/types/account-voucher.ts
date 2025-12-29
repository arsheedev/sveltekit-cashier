export interface AccountVoucher {
	id: number;
	accountId: number;
	voucherId: number;
	isUsed: boolean;
	redeemedAt: Date;
}
