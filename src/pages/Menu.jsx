import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import initialMenuData from '../data/menu.json'; // Renamed to initialMenuData

function Menu({ onSaveMenuData }) { // Accept onSaveMenuData as a prop
    const [menuData, setMenuData] = useState(initialMenuData); // Use state for menu data
    const [selectedCategory, setSelectedCategory] = useState(initialMenuData.length > 0 ? initialMenuData[0].category : ''); // Default to first category
    const [editingItem, setEditingItem] = useState(null); // Stores { category: '...', itemId: '...' }
    const [editedName, setEditedName] = useState('');
    const [editedPrice, setEditedPrice] = useState('');

    const categories = menuData.map(category => category.category);

    const filteredMenu = menuData.filter(category =>
        category.category === selectedCategory
    );

    const handleEditClick = (category, item) => {
        setEditingItem({ category: category.category, itemId: item.id });
        setEditedName(item.name);
        setEditedPrice(item.price);
    };

    const handleSaveEdit = () => {
        const updatedMenuData = menuData.map(category => {
            if (category.category === editingItem.category) {
                return {
                    ...category,
                    items: category.items.map(item => {
                        if (item.id === editingItem.itemId) { // Use item.id for comparison
                            return { ...item, name: editedName, price: parseFloat(editedPrice) };
                        }
                        return item;
                    }),
                };
            }
            return category;
        });
        setMenuData(updatedMenuData);
        setEditingItem(null); // Exit edit mode

        // Call the prop function to save data externally
        if (onSaveMenuData) {
            onSaveMenuData(updatedMenuData);
        }
    };

    const handleCancelEdit = () => {
        setEditingItem(null); // Exit edit mode without saving
    };

    return (
        <div style={styles.container}>
            <nav style={styles.navbar}>
                <h1 style={styles.logo}>Drink Store Admin</h1>
                <div style={styles.navLinks}>
                    <Link to="/Dashboard-Admin/dash" style={styles.navLink}>Dashboard</Link>
                    <Link to="/Dashboard-Admin/menu" style={styles.navLink}>Menu</Link>
                </div>
            </nav>

            <div style={styles.menuContent}>
                <div style={styles.categoryNav}>
                    {categories.map(category => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            style={{
                                ...styles.categoryButton,
                                ...(selectedCategory === category && styles.activeCategoryButton)
                            }}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {filteredMenu.map(category => (
                    <div key={category.category} style={styles.categorySection}>
                        <h3 style={styles.categoryTitle}>{category.category}</h3>
                        <div style={styles.itemsGrid}>
                            {category.items.map(item => (
                                <div key={item.id} style={styles.itemCard}> {/* Use item.id as key */}
                                    <div style={styles.itemOptions}>
                                        <button onClick={() => handleEditClick(category, item)} style={styles.editButton}>
                                            ...
                                        </button>
                                    </div>
                                    <img src="https://via.placeholder.com/150x100?text=Drink" alt={item.name} style={styles.itemImage} />

                                    {(editingItem && editingItem.category === category.category && editingItem.itemId === item.id) ? (
                                        <div style={styles.editForm}>
                                            <input
                                                type="text"
                                                value={editedName}
                                                onChange={(e) => setEditedName(e.target.value)}
                                                style={styles.editInput}
                                            />
                                            <input
                                                type="number"
                                                value={editedPrice}
                                                onChange={(e) => setEditedPrice(e.target.value)}
                                                style={styles.editInput}
                                            />
                                            <div style={styles.editActions}>
                                                <button onClick={handleSaveEdit} style={{ ...styles.actionButton, backgroundColor: '#28a745' }}>Save</button>
                                                <button onClick={handleCancelEdit} style={{ ...styles.actionButton, backgroundColor: '#dc3545' }}>Cancel</button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <h4 style={styles.itemName}>{item.name}</h4>
                                            <p style={styles.itemPrice}>VND {item.price.toLocaleString()}</p>
                                        </>
                                    )}

                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

const styles = {
    container: {
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        backgroundColor: '#eef2f6',
        minHeight: '100vh',
        color: '#333',
    },
    navbar: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '15px 40px',
        backgroundColor: '#2c3e50',
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
    navLinkHover: {
        backgroundColor: '#34495e',
    },
    menuContent: {
        padding: '30px',
        maxWidth: '1200px',
        margin: '30px auto',
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 6px 20px rgba(0,0,0,0.08)',
    },
    menuTitle: {
        fontSize: '32px',
        fontWeight: '700',
        color: '#2c3e50',
        marginBottom: '30px',
        textAlign: 'center',
    },
    categoryNav: {
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: '15px',
        marginBottom: '40px',
        paddingBottom: '15px',
        borderBottom: '1px solid #e0e0e0',
    },
    categoryButton: {
        padding: '10px 20px',
        border: '1px solid #bdc3c7',
        borderRadius: '25px',
        backgroundColor: '#ecf0f1',
        cursor: 'pointer',
        fontSize: '16px',
        fontWeight: '500',
        color: '#2c3e50',
        transition: 'background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease',
        outline: 'none',
    },
    activeCategoryButton: {
        backgroundColor: '#3498db',
        color: 'white',
        borderColor: '#3498db',
    },
    categorySection: {
        marginBottom: '40px',
    },
    categoryTitle: {
        fontSize: '26px',
        fontWeight: '600',
        color: '#34495e',
        marginBottom: '20px',
        borderBottom: '2px solid #eef2f6',
        paddingBottom: '10px',
    },
    itemsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '25px',
    },
    itemCard: {
        backgroundColor: '#ffffff',
        border: '1px solid #e0e0e0',
        borderRadius: '10px',
        padding: '15px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
        transition: 'transform 0.2s ease',
        position: 'relative', // Needed for absolute positioning of edit icon
    },
    itemOptions: {
        position: 'absolute',
        top: '10px',
        right: '10px',
    },
    editButton: {
        backgroundColor: 'transparent',
        border: 'none',
        fontSize: '20px',
        cursor: 'pointer',
        color: '#7f8c8d',
    },
    editForm: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        gap: '8px',
    },
    editInput: {
        width: '100%',
        padding: '8px',
        border: '1px solid #ccc',
        borderRadius: '5px',
        fontSize: '14px',
    },
    editActions: {
        display: 'flex',
        gap: '8px',
        justifyContent: 'center',
        marginTop: '10px',
    },
    actionButton: {
        padding: '8px 12px',
        border: 'none',
        borderRadius: '5px',
        color: 'white',
        cursor: 'pointer',
        fontSize: '14px',
        transition: 'background-color 0.2s ease',
    },
    itemCardHover: {
        transform: 'translateY(-5px)',
    },
    itemImage: {
        width: '100%',
        height: '100px',
        objectFit: 'cover',
        borderRadius: '8px',
        marginBottom: '10px',
    },
    itemName: {
        fontSize: '18px',
        fontWeight: '600',
        color: '#2c3e50',
        marginBottom: '5px',
    },
    itemPrice: {
        fontSize: '16px',
        fontWeight: '700',
        color: '#27ae60', // Green for price
    },
};

export default Menu;
