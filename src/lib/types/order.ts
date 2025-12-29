export interface Order {
	id: number;
	accountId: number;
	customerName: string;
	customerPhone: string;
	totalPrice: number;
	pointsEarned: number;
	voucherId?: number;
	status: string;
	stripePaymentIntentId?: string;
	createdAt: Date;
}
