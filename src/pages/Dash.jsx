import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js/auto';

import ordersDetailsData from '../data/orders_details.json';
import incomeData from '../data/income.json';
import menuData from '../data/menu.json';
import clientsData from '../data/client.json';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function Dash() {
    const [selectedIncomePeriod, setSelectedIncomePeriod] = useState('daily');
    const [chartData, setChartData] = useState({ labels: [], datasets: [] });
    const [totalRevenueForPeriod, setTotalRevenueForPeriod] = useState(0);

    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);

    useEffect(() => {
        const data = incomeData[selectedIncomePeriod];
        let labels = [];
        let revenues = [];
        let total = 0;

        if (data) {
            labels = data.map(item => {
                if (selectedIncomePeriod === 'daily') return item.date;
                if (selectedIncomePeriod === 'monthly') return item.month;
                if (selectedIncomePeriod === 'yearly') return item.year;
                return '';
            });
            revenues = data.map(item => item.revenue);
            total = revenues.reduce((sum, current) => sum + current, 0);
        }

        setChartData({
            labels: labels,
            datasets: [
                {
                    label: 'Doanh thu (VND)',
                    data: revenues,
                    borderColor: '#3498db',
                    backgroundColor: 'rgba(52, 152, 219, 0.2)',
                    fill: true,
                    tension: 0.3,
                },
            ],
        });
        setTotalRevenueForPeriod(total);
    }, [selectedIncomePeriod]);

    useEffect(() => {
        if (ordersDetailsData.length > 0) {
            setSelectedOrderId(ordersDetailsData[0].id);
            setSelectedOrderDetails(ordersDetailsData[0]);
        }
    }, []);

    const handleOrderSelect = (orderId) => {
        const order = ordersDetailsData.find(o => o.id === orderId);
        setSelectedOrderId(orderId);
        setSelectedOrderDetails(order);
    };

    // Calculate total number of current orders
    const totalCurrentOrders = ordersDetailsData.length;

    // Calculate top 10 best-selling drinks
    const allDrinks = menuData.flatMap(category => category.items);
    const top10Drinks = [...allDrinks].sort((a, b) => b.sold - a.sold).slice(0, 10);
    const top5Drinks = top10Drinks.slice(0, 5);
    const next5Drinks = top10Drinks.slice(5, 10);

    // Calculate top 10 best customers
    const top10Clients = [...clientsData].sort((a, b) => b.totalPurchases - a.totalPurchases).slice(0, 10);
    const top5Clients = top10Clients.slice(0, 5);
    const next5Clients = top10Clients.slice(5, 10);

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: `Doanh thu (VND)`,
            },
        },
        scales: {
            x: {
                grid: {
                    display: false,
                },
            },
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Doang thu (VND)',
                },
            },
        },
    };

    return (
        <div style={styles.container}>
            <nav style={styles.navbar}>
                <h1 style={styles.logo}>Drink Store Admin</h1>
                <div style={styles.navLinks}>
                    <Link to="/Dashboard-Admin/dash" style={styles.navLink}>Tổng quan</Link>
                    <Link to="/Dashboard-Admin/menu" style={styles.navLink}>Thực đơn</Link>
                </div>
            </nav>

            <div style={styles.content}>
                {/* Section 1: Current Orders */}
                <div style={{ ...styles.card, ...styles.orderOverviewCard }}>
                    <h3 style={styles.cardTitle}>Các đơn hàng hiện tại</h3>
                    <div style={styles.orderContentWrapper}>
                        <div style={styles.orderListColumn}>
                            <p style={styles.totalOrdersCount}>Tổng: {totalCurrentOrders}</p>
                            <div style={styles.orderIdNavbar}>
                                {ordersDetailsData.map((order, index) => (
                                    <button
                                        key={order.id}
                                        onClick={() => handleOrderSelect(order.id)}
                                        style={{ ...styles.orderIdButton, ...(selectedOrderId === order.id && styles.activeOrderIdButton) }}
                                    >
                                        {index + 1}.  {order.id}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div style={styles.orderDetailsColumn}>
                            {selectedOrderDetails ? (
                                <>
                                    <h4 style={styles.orderDetailsTitle}>Mã đơn: {selectedOrderDetails.id}</h4>
                                    <ul style={styles.orderItemsList}>
                                        {selectedOrderDetails.items.map((item, index) => (
                                            <li key={index} style={styles.orderItem}>
                                                <span>{item.name} x {item.quantity}</span>
                                                <span>VND {(item.price * item.quantity).toLocaleString()}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <p style={styles.orderTotal}>Tổng: <strong> {selectedOrderDetails.total.toLocaleString()} VND</strong></p>
                                </>
                            ) : (
                                <p>Chọn 1 đơn hàng để xem.</p>
                            )}
                        </div>
                    </div>
                </div>


            </div>
            <div style={styles.content}>


                {/* Section 2: Revenue */}

                <div style={{ ...styles.card, ...styles.revenueCard }}>
                    <h3 style={styles.cardTitle}>Tổng quan về doanh thu</h3>
                    <div style={styles.incomePeriodSelector}>
                        <button onClick={() => setSelectedIncomePeriod('daily')} style={{ ...styles.periodButton, ...(selectedIncomePeriod === 'daily' && styles.activePeriodButton) }}>Ngày</button>
                        <button onClick={() => setSelectedIncomePeriod('monthly')} style={{ ...styles.periodButton, ...(selectedIncomePeriod === 'monthly' && styles.activePeriodButton) }}>Tháng</button>
                        <button onClick={() => setSelectedIncomePeriod('yearly')} style={{ ...styles.periodButton, ...(selectedIncomePeriod === 'yearly' && styles.activePeriodButton) }}>Năm</button>
                    </div>
                    <div style={styles.chartContainer}>
                        <Line data={chartData} options={chartOptions} />
                    </div>
                    <p style={styles.cardFooter}>Tổng: <strong> {totalRevenueForPeriod.toLocaleString()} VND</strong></p>
                </div>


            </div>
            <div style={styles.content}>


                {/* Section 3: Top 10 Best-Selling Drinks */}
                <div style={styles.card}>
                    <h3 style={styles.cardTitle}>Top 10 đồ uống bán chạy nhất</h3>
                    <div style={styles.twoColumnWrapper}>
                        <ul style={styles.rankList}>
                            {top5Drinks.map((drink, index) => (
                                <li key={index} style={styles.rankListItem}>
                                    <span style={styles.rankNumber}>{index + 1}.</span>
                                    <span style={styles.itemName}>{drink.name}</span>
                                    <span style={styles.itemValue}>{drink.sold} cốc</span>
                                </li>
                            ))}
                        </ul>
                        <ul style={styles.rankList}>
                            {next5Drinks.map((drink, index) => (
                                <li key={index} style={styles.rankListItem}>
                                    <span style={styles.rankNumber}>{index + 6}.</span>
                                    <span style={styles.itemName}>{drink.name}</span>
                                    <span style={styles.itemValue}>{drink.sold} cốc</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>


            </div>
            <div style={styles.content}>


                {/* Section 4: Top 10 Best Customers */}
                <div style={styles.card}>
                    <h3 style={styles.cardTitle}>Top 10 khách hàng mua nhiều nhất</h3>
                    <div style={styles.twoColumnWrapper}>
                        <ul style={styles.rankList}>
                            {top5Clients.map((client, index) => (
                                <li key={index} style={styles.rankListItem}>
                                    <span style={styles.rankNumber}>{index + 1}.</span>
                                    <span style={styles.itemName}>{client.name}</span>
                                    <span style={styles.itemValue}>{client.totalPurchases.toLocaleString()} VND</span>
                                </li>
                            ))}
                        </ul>
                        <ul style={styles.rankList}>
                            {next5Clients.map((client, index) => (
                                <li key={index} style={styles.rankListItem}>
                                    <span style={styles.rankNumber}>{index + 6}.</span>
                                    <span style={styles.itemName}>{client.name}</span>
                                    <span style={styles.itemValue}>{client.totalPurchases.toLocaleString()} VND</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

const styles = {
    container: {
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        backgroundColor: '#eef2f6', // Light background for the whole page
        minHeight: '100vh',
        color: '#333',
    },
    navbar: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '15px 40px',
        backgroundColor: '#2c3e50', // Darker blue for navbar
        color: 'white',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
    },
    logo: {
        margin: 0,
        fontSize: '26px',
        fontWeight: '700',
    },
    navLinks: {
        display: 'flex',
        gap: '25px',
    },
    navLink: {
        color: 'white',
        textDecoration: 'none',
        fontSize: '17px',
        fontWeight: '500',
        padding: '5px 10px',
        borderRadius: '5px',
        transition: 'background-color 0.3s ease',
    },
    navLinkHover: { // For future hover state if not using pseudo-classes
        backgroundColor: '#34495e',
    },
    content: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '30px',
        padding: '30px',
        maxWidth: '1300px', // Slightly wider content area
        margin: '30px auto',
    },
    card: {
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '12px',
        boxShadow: '0 6px 20px rgba(0,0,0,0.08)', // Enhanced shadow
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        transition: 'transform 0.3s ease',
    },
    cardHover: { // For future hover state
        transform: 'translateY(-5px)',
    },
    cardTitle: {
        fontSize: '22px',
        fontWeight: '600',
        color: '#2c3e50',
        marginBottom: '20px',
    },
    orderCount: {
        fontSize: '60px',
        fontWeight: '700',
        color: '#27ae60', // Green for positive numbers
        margin: '10px 0',
    },
    cardFooter: {
        fontSize: '14px',
        color: '#7f8c8d',
        // marginTop: 'auto', // Push to bottom
        paddingBottom: '15px',
        borderTop: '1px solid #ecf0f1',
        width: '100%',
    },
    revenueCard: {
        gridColumn: 'span 2', // Make revenue chart wider
        height: '450px', // Fixed height for chart
        justifyContent: 'space-between',
    },
    incomePeriodSelector: {
        display: 'flex',
        gap: '12px',
        marginBottom: '20px',
        marginTop: '10px',
    },
    periodButton: {
        padding: '10px 20px',
        border: '1px solid #bdc3c7',
        borderRadius: '8px',
        backgroundColor: '#ecf0f1',
        cursor: 'pointer',
        fontSize: '15px',
        fontWeight: '500',
        color: '#2c3e50',
        transition: 'background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease',
        outline: 'none',
    },
    activePeriodButton: {
        backgroundColor: '#3498db',
        color: 'white',
        borderColor: '#3498db',
    },
    chartContainer: {
        flexGrow: 1,
        width: '100%',
        minHeight: '250px', // Ensure chart has space
        maxHeight: '300px',
        marginBottom: '20px',
    },
    twoColumnWrapper: { // New style for two columns inside a card
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '20px',
        width: '100%',
    },
    rankList: { // New style for ranked lists
        listStyle: 'none',
        padding: 0,
        margin: 0,
        width: '100%',
    },
    rankListItem: { // New style for ranked list items
        display: 'flex',
        alignItems: 'center',
        padding: '12px 0',
        borderBottom: '1px solid #ecf0f1',
        fontSize: '16px',
        color: '#34495e',
        transition: 'background-color 0.3s ease',
        textAlign: 'left',
    },
    rankNumber: {
        fontSize: '18px',
        fontWeight: '700',
        color: '#3498db',
        marginRight: '15px',
        width: '30px', // Fixed width for rank number
        flexShrink: 0,
    },
    itemName: {
        flexGrow: 1,
        fontWeight: '500',
    },
    itemValue: {
        fontWeight: '400',
        color: '#7f8c8d',
        marginLeft: '15px',
    },
    orderOverviewCard: {
        gridColumn: 'span 2', // Make it wider, similar to revenue card
        minHeight: '450px', // Give it a fixed height for better consistency
        justifyContent: 'flex-start', // Align content to the top
        alignItems: 'flex-start', // Align items to the start
        textAlign: 'left', // Align text left within the card
    },
    orderContentWrapper: {
        display: 'flex',
        flexDirection: 'row', // Arrange columns side-by-side
        width: '100%',
        gap: '20px',
        marginTop: '15px',
        flexWrap: 'wrap', // Allow columns to wrap on smaller screens
        minHeight: '300px', // Ensure wrapper has min height
    },
    orderListColumn: {
        flex: '1 1 200px', // Flex properties for the order list column
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        borderRight: '1px solid #eceff1', // Subtle separator line
        paddingRight: '20px',
        maxHeight: '350px', // Limit height of this column
    },
    totalOrdersCount: {
        fontSize: '24px',
        fontWeight: '700',
        color: '#2c3e50',
        marginBottom: '10px',
        alignSelf: 'stretch', // Make it span full width
        paddingBottom: '10px',
        borderBottom: '1px solid #eceff1',
        width: '100%',
        textAlign: 'center',
    },
    orderIdNavbar: {
        display: 'flex',
        flexDirection: 'column', // Stack order ID buttons vertically
        gap: '8px',
        maxHeight: '280px', // Limit height for scrollability
        overflowY: 'auto', // Enable vertical scrolling
        paddingRight: '5px', // Provide space for scrollbar
        scrollbarWidth: 'thin', // For Firefox
        scrollbarColor: '#ccc transparent', // For Firefox
    },
    orderIdButton: {
        padding: '10px 15px',
        border: '1px solid #dcdcdc',
        borderRadius: '8px',
        backgroundColor: '#fdfdfd',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '500',
        color: '#555',
        transition: 'all 0.3s ease',
        textAlign: 'left', // Align text left within the button
        width: '100%',
        boxShadow: '0 2px 4px rgba(0,0,0,0.04)', // Subtle shadow for buttons
        outline: 'none',
    },
    activeOrderIdButton: {
        backgroundColor: '#3498db',
        color: 'white',
        borderColor: '#3498db',
        boxShadow: '0 4px 8px rgba(52, 152, 219, 0.2)',
        fontWeight: '700',
    },
    orderDetailsColumn: {
        flex: '2 1 300px', // Make this column relatively wider
        paddingLeft: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
        maxHeight: '350px', // Limit height of this column
    },
    orderDetailsTitle: {
        fontSize: '20px',
        fontWeight: '600',
        color: '#2c3e50',
        marginBottom: '10px',
        borderBottom: '1px solid #eceff1',
        paddingBottom: '10px',
    },
    orderItemsList: {
        listStyle: 'none',
        padding: 0,
        margin: 0,
        flexGrow: 1, // Allow the list to grow and take available space
        overflowY: 'auto', // Enable vertical scrolling for long order lists
        maxHeight: '200px', // Limit height for individual items list
        scrollbarWidth: 'thin', // For Firefox
        scrollbarColor: '#ccc transparent', // For Firefox
    },
    orderItem: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '10px 0',
        borderBottom: '1px dashed #e0e0e0', // Dashed separator for items
        fontSize: '15px',
        color: '#444',
    },
    orderTotal: {
        fontSize: '18px',
        fontWeight: '700',
        color: '#27ae60', // Green for positive total
        borderTop: '1px solid #eceff1',
        paddingTop: '15px',
        marginTop: '15px',
        textAlign: 'right', // Align total to the right
        width: '100%',
    },
};

export default Dash;
