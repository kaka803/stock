import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Order from '@/models/Order';
import User from '@/models/User';
import Stock from '@/models/Stock';

export async function GET(req) {
  try {
    await connectDB();
    
    // Auth Check (Env based)
    const adminToken = req.cookies.get('admin_token')?.value;
    if (adminToken !== 'authenticated') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 1. Basic Counts
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalOrders = await Order.countDocuments({});
    const pendingOrders = await Order.countDocuments({ status: 'pending' });
    
    // 2. Financial Metrics
    const volumeResult = await Order.aggregate([
      { $match: { status: 'verified' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    const totalVolume = volumeResult[0]?.total || 0;

    // 3. Top Stocks (Just getting some sample stocks for now or most active ones)
    const topStocks = await Stock.find({ isCustom: true }).limit(4).lean();

    // 4. Chart Data (Last 6-7 months or arbitrary for now, but better than static)
    // In a real app, you'd aggregate orders by month
    const chartData = await Order.aggregate([
      { $match: { status: 'verified' } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          value: { $sum: "$totalAmount" }
        }
      },
      { $sort: { "_id": 1 } },
      { $limit: 12 }
    ]).then(data => data.map(item => ({
      name: item._id,
      value: item.value
    })));

    // Fallback chart data if empty
    const finalChartData = chartData.length > 0 ? chartData : [
      { name: 'Jan', value: 0 },
      { name: 'Feb', value: 0 },
      { name: 'Mar', value: 0 }
    ];

    // 5. Recent Stocks List (Side panel)
    const allStocksCount = await Stock.countDocuments({});

    return NextResponse.json({
      success: true,
      stats: {
        users: totalUsers,
        orders: totalOrders,
        pending: pendingOrders,
        volume: totalVolume,
        topStocks,
        chartData: finalChartData,
        stockCount: allStocksCount
      }
    });

  } catch (error) {
    console.error("Admin stats error:", error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
