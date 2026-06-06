// backend/controllers/walletController.js
const Wallet = require("../Models/walletModel");
const Farmer = require("../Models/farmerModel");
const Order = require("../Models/orderModel");

/**
 * Get farmer wallet
 */
exports.getWallet = async (req, res) => {
  try {
    const { farmerId } = req.params;

    const wallet = await Wallet.findOne({ farmerId: farmerId });

    if (!wallet) {
      return res.status(404).json({
        success: false,
        message: "Wallet not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: wallet,
    });
  } catch (error) {
    console.log("Get Wallet Error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching wallet",
    });
  }
};

/**
 * Add earnings to wallet
 */
exports.addEarnings = async (req, res) => {
  try {
    const { farmerId, amount, orderId, description } = req.body;

    let wallet = await Wallet.findOne({ farmerId: farmerId });

    if (!wallet) {
      wallet = new Wallet({ farmerId });
    }

    // Add transaction
    wallet.transactions.push({
      transactionId: `TXN-${Date.now()}`,
      type: "credit",
      amount: amount,
      description: description,
      orderId: orderId,
      status: "completed",
    });

    // Update balances
    wallet.totalBalance += amount;
    wallet.pendingBalance += amount;

    // Update farmer stats
    const farmer = await Farmer.findByIdAndUpdate(farmerId, {
      $inc: { totalEarnings: amount, walletBalance: amount },
    });

    await wallet.save();

    return res.status(200).json({
      success: true,
      message: "Earnings added successfully",
      data: wallet,
    });
  } catch (error) {
    console.log("Add Earnings Error:", error);
    res.status(500).json({
      success: false,
      message: "Error adding earnings",
    });
  }
};

/**
 * Deduct pickup charges from wallet
 */
exports.deductPickupCharge = async (req, res) => {
  try {
    const { farmerId, pickupCharge, orderId } = req.body;

    let wallet = await Wallet.findOne({ farmerId: farmerId });

    if (!wallet) {
      wallet = new Wallet({ farmerId });
    }

    // Add debit transaction
    wallet.transactions.push({
      transactionId: `TXN-${Date.now()}`,
      type: "debit",
      amount: pickupCharge,
      description: "Pickup charge deducted",
      orderId: orderId,
      status: "completed",
    });

    // Update balance
    wallet.totalBalance -= pickupCharge;

    // Update farmer stats
    const farmer = await Farmer.findByIdAndUpdate(farmerId, {
      $inc: { totalPickupCharges: pickupCharge, walletBalance: -pickupCharge },
    });

    await wallet.save();

    return res.status(200).json({
      success: true,
      message: "Pickup charge deducted",
      data: wallet,
    });
  } catch (error) {
    console.log("Deduct Pickup Charge Error:", error);
    res.status(500).json({
      success: false,
      message: "Error deducting pickup charge",
    });
  }
};

/**
 * Request withdrawal
 */
exports.requestWithdrawal = async (req, res) => {
  try {
    const { farmerId, amount, bankDetails } = req.body;

    const wallet = await Wallet.findOne({ farmerId: farmerId });

    if (!wallet) {
      return res.status(404).json({
        success: false,
        message: "Wallet not found",
      });
    }

    if (wallet.totalBalance < amount) {
      return res.status(400).json({
        success: false,
        message: "Insufficient balance",
      });
    }

    wallet.withdrawalRequests.push({
      requestId: `WR-${Date.now()}`,
      amount: amount,
      bankDetails: bankDetails,
      status: "pending",
      requestedAt: new Date(),
    });

    await wallet.save();

    return res.status(200).json({
      success: true,
      message: "Withdrawal request submitted successfully",
      data: wallet,
    });
  } catch (error) {
    console.log("Request Withdrawal Error:", error);
    res.status(500).json({
      success: false,
      message: "Error requesting withdrawal",
    });
  }
};

/**
 * Process withdrawal (Admin)
 */
exports.processWithdrawal = async (req, res) => {
  try {
    const { walletId, withdrawalRequestId, status, remarks } = req.body;

    const wallet = await Wallet.findByIdAndUpdate(
      walletId,
      {
        $set: {
          "withdrawalRequests.$[elem].status": status,
          "withdrawalRequests.$[elem].remarks": remarks,
          "withdrawalRequests.$[elem].completedAt": status === "completed" ? new Date() : null,
        },
      },
      {
        arrayFilters: [{ "elem.requestId": withdrawalRequestId }],
        new: true,
      }
    );

    if (status === "completed") {
      wallet.totalBalance -= wallet.withdrawalRequests.find((r) => r.requestId === withdrawalRequestId).amount;
      wallet.withdrawnBalance += wallet.withdrawalRequests.find((r) => r.requestId === withdrawalRequestId).amount;
      await wallet.save();
    }

    return res.status(200).json({
      success: true,
      message: "Withdrawal processed",
      data: wallet,
    });
  } catch (error) {
    console.log("Process Withdrawal Error:", error);
    res.status(500).json({
      success: false,
      message: "Error processing withdrawal",
    });
  }
};

/**
 * Get wallet history
 */
exports.getWalletHistory = async (req, res) => {
  try {
    const { farmerId } = req.params;
    const { limit = 10, skip = 0 } = req.query;

    const wallet = await Wallet.findOne({ farmerId: farmerId });

    if (!wallet) {
      return res.status(404).json({
        success: false,
        message: "Wallet not found",
      });
    }

    const transactions = wallet.transactions.slice(skip, skip + limit);
    const totalTransactions = wallet.transactions.length;

    return res.status(200).json({
      success: true,
      data: {
        wallet: {
          totalBalance: wallet.totalBalance,
          pendingBalance: wallet.pendingBalance,
          withdrawnBalance: wallet.withdrawnBalance,
        },
        transactions: transactions,
        total: totalTransactions,
      },
    });
  } catch (error) {
    console.log("Get Wallet History Error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching wallet history",
    });
  }
};
