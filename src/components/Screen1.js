import React, { useState, useEffect } from "react";
import axios from "axios";
import './Screen1.css';

const initialFormState = {
    accountId: '',
    accountName: '',
    accountNumber: '',
    accountType: '',
    bankAddress: '',
    bankBranch: '',
    bankName: '',
    ifscCode: '',
    micrCode: '',
    organizationId: '',
    bankBranchSolId: '',
    campusId: '',
    activeStatus: ''
};

const Organization = () => {
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState(initialFormState);
    const [tableData, setTableData] = useState([]);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editAccountId, setEditAccountId] = useState(null);

    // Fetch all organizations on component mount
    useEffect(() => {
        const fetchOrganizations = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/organizations/ListofAll');
                setTableData(response.data);
            } catch (error) {
                console.error('Error fetching organizations:', error);
            }
        };
        fetchOrganizations();
    }, []);

    const handleAddNewClick = () => {
        setShowForm(true);
        setIsEditMode(false);
        setFormData(initialFormState);
        setEditAccountId(null);
    };

    const handleCancel = () => {
        setShowForm(false);
        setFormData(initialFormState);
        setIsEditMode(false);
        setEditAccountId(null);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAddField = async () => {
        try {
            if (isEditMode) {
                // Update organization
                if (!editAccountId) throw new Error("No account ID to update");
                const response = await axios.put(`http://localhost:8080/api/organizations/${editAccountId}`, formData);
                setTableData(tableData.map(item => item.accountId === editAccountId ? response.data : item));
            } else {
                // Create new organization
                const response = await axios.post('http://localhost:8080/api/organizations/addOrganisation', formData);
                setTableData([...tableData, response.data]);
            }
            handleCancel();
        } catch (error) {
            console.error('Error saving organization:', error);
        }
    };

    const handleViewClick = async (accountId) => {
        try {
            if (!accountId) throw new Error("No account ID to fetch");
            const response = await axios.get(`http://localhost:8080/api/organizations/${accountId}`);
            setFormData(response.data);
            setEditAccountId(accountId);
            setIsEditMode(true);
            setShowForm(true);
        } catch (error) {
            console.error('Error fetching organization:', error);
        }
    };

    const handleDeleteClick = async (accountId) => {
        try {
            if (!accountId) throw new Error("No account ID to delete");
            await axios.delete(`http://localhost:8080/api/organizations/${accountId}`);
            setTableData(tableData.filter(item => item.accountId !== accountId));
            handleCancel();
        } catch (error) {
            console.error('Error deleting organization:', error);
        }
    };

    return (
        <div className="main-section">
            <div className="feeheads-container">
                <h1 className="title">Organization</h1>
                <div className="button-group">
                    <button className="action-btn-filter">
                        <svg width="65" height="24" viewBox="0 0 65 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clip-path="url(#clip0_4_34476)">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M5 5C5 4.73478 5.10536 4.48043 5.29289 4.29289C5.48043 4.10536 5.73478 4 6 4H18C18.2652 4 18.5196 4.10536 18.7071 4.29289C18.8946 4.48043 19 4.73478 19 5V8C18.9999 8.26519 18.8946 8.51951 18.707 8.707L14 13.414V17C13.9999 17.2652 13.8945 17.5195 13.707 17.707L11.707 19.707C11.5671 19.8468 11.389 19.942 11.195 19.9806C11.0011 20.0192 10.8 19.9993 10.6173 19.9237C10.4346 19.848 10.2785 19.7199 10.1686 19.5555C10.0587 19.391 10 19.1978 10 19V13.414L5.293 8.707C5.10545 8.51951 5.00006 8.26519 5 8V5Z" fill="#5B6871" />
                                <path d="M33.233 17H34.4659V12.446H38.8807V11.3523H34.4659V7.91193H39.3381V6.81818H33.233V17ZM41.2067 17H42.38V9.36364H41.2067V17ZM41.8033 8.09091C42.2606 8.09091 42.6385 7.73295 42.6385 7.29545C42.6385 6.85795 42.2606 6.5 41.8033 6.5C41.3459 6.5 40.968 6.85795 40.968 7.29545C40.968 7.73295 41.3459 8.09091 41.8033 8.09091ZM45.6182 6.81818H44.4449V17H45.6182V6.81818ZM51.0042 9.36364H49.3735V7.53409H48.2002V9.36364H47.0468V10.358H48.2002V15.1307C48.2002 16.4631 49.2741 17.0994 50.2684 17.0994C50.7059 17.0994 50.9843 17.0199 51.1434 16.9602L50.9048 15.9062C50.8054 15.9261 50.6463 15.9659 50.3877 15.9659C49.8707 15.9659 49.3735 15.8068 49.3735 14.8125V10.358H51.0042V9.36364ZM55.8048 17.1591C57.3559 17.1591 58.4895 16.3835 58.8474 15.2301L57.7139 14.9119C57.4156 15.7074 56.7245 16.1051 55.8048 16.1051C54.4277 16.1051 53.4781 15.2152 53.4234 13.5795H58.9667V13.0824C58.9667 10.2386 57.2764 9.2642 55.6855 9.2642C53.6173 9.2642 52.2451 10.8949 52.2451 13.2415C52.2451 15.5881 53.5974 17.1591 55.8048 17.1591ZM53.4234 12.5653C53.503 11.3771 54.3432 10.3182 55.6855 10.3182C56.9582 10.3182 57.7736 11.2727 57.7736 12.5653H53.4234ZM60.6675 17H61.8408V12.1676C61.8408 11.1335 62.6562 10.3778 63.7698 10.3778C64.083 10.3778 64.4062 10.4375 64.4857 10.4574V9.2642C64.3515 9.25426 64.0432 9.24432 63.8692 9.24432C62.9545 9.24432 62.159 9.76136 61.8806 10.517H61.8011V9.36364H60.6675V17Z" fill="#252C32" />
                            </g>
                            <defs>
                                <clipPath id="clip0_4_34476">
                                    <rect width="65" height="24" fill="white" />
                                </clipPath>
                            </defs>
                        </svg>
                        <span className="notification-badge">1</span>
                    </button>
                    <button className="action-btn-export">
                        <svg width="76" height="24" viewBox="0 0 76 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clip-path="url(#clip0_4_34483)">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M5.29303 11.7068C5.10556 11.5193 5.00024 11.265 5.00024 10.9998C5.00024 10.7346 5.10556 10.4803 5.29303 10.2928L11.293 4.29279C11.4806 4.10532 11.7349 4 12 4C12.2652 4 12.5195 4.10532 12.707 4.29279L18.707 10.2928C18.8892 10.4814 18.99 10.734 18.9877 10.9962C18.9854 11.2584 18.8803 11.5092 18.6948 11.6946C18.5094 11.88 18.2586 11.9852 17.9964 11.9875C17.7342 11.9897 17.4816 11.8889 17.293 11.7068L13 7.41379V18.9998C13 19.265 12.8947 19.5194 12.7071 19.7069C12.5196 19.8944 12.2652 19.9998 12 19.9998C11.7348 19.9998 11.4805 19.8944 11.2929 19.7069C11.1054 19.5194 11 19.265 11 18.9998V7.41379L6.70703 11.7068C6.5195 11.8943 6.26519 11.9996 6.00003 11.9996C5.73487 11.9996 5.48056 11.8943 5.29303 11.7068Z" fill="#5B6871" />
                                <path d="M33.233 17H39.4574V15.9062H34.4659V12.446H39.0597V11.3523H34.4659V7.91193H39.3778V6.81818H33.233V17ZM42.2321 9.36364H40.8798L43.3059 13.1818L40.8798 17H42.2321L44.0616 14.0369L45.8911 17H47.2434L44.7775 13.1818L47.2434 9.36364H45.8911L44.0616 12.4858L42.2321 9.36364ZM48.8336 19.8636H50.0069V15.8267H50.1063C50.3648 16.2443 50.862 17.1591 52.3336 17.1591C54.2427 17.1591 55.5751 15.6278 55.5751 13.2017C55.5751 10.7955 54.2427 9.2642 52.3137 9.2642C50.8222 9.2642 50.3648 10.179 50.1063 10.5767H49.9671V9.36364H48.8336V19.8636ZM49.987 13.1818C49.987 11.4716 50.7427 10.3182 52.1745 10.3182C53.666 10.3182 54.4018 11.571 54.4018 13.1818C54.4018 14.8125 53.6461 16.1051 52.1745 16.1051C50.7626 16.1051 49.987 14.9119 49.987 13.1818ZM60.3831 17.1591C62.4513 17.1591 63.8433 15.5881 63.8433 13.2216C63.8433 10.8352 62.4513 9.2642 60.3831 9.2642C58.3149 9.2642 56.9229 10.8352 56.9229 13.2216C56.9229 15.5881 58.3149 17.1591 60.3831 17.1591ZM60.3831 16.1051C58.8121 16.1051 58.0962 14.7528 58.0962 13.2216C58.0962 11.6903 58.8121 10.3182 60.3831 10.3182C61.9541 10.3182 62.6701 11.6903 62.6701 13.2216C62.6701 14.7528 61.9541 16.1051 60.3831 16.1051ZM65.5504 17H66.7237V12.1676C66.7237 11.1335 67.539 10.3778 68.6526 10.3778C68.9658 10.3771 69.289 10.4375 69.3685 10.4574V9.2642C69.2343 9.25426 68.9261 9.24432 68.7521 9.24432C67.8373 9.24432 67.0418 9.76136 66.7634 10.517H66.6839V9.36364H65.5504V17ZM74.4749 9.36364H72.8442V7.53409H71.6709V9.36364H70.5175V10.358H71.6709V15.1307C71.6709 16.4631 72.7448 17.0994 73.7391 17.0994C74.1766 17.0994 74.455 17.0199 74.6141 16.9602L74.3755 15.9062C74.276 15.9261 74.1169 15.9659 73.8584 15.9659C73.3414 15.9659 72.8442 15.8068 72.8442 14.8125V10.358H74.4749V9.36364Z" fill="#252C32" />
                            </g>
                            <defs>
                                <clipPath id="clip0_4_34483">
                                    <rect width="76" height="24" fill="white" />
                                </clipPath>
                            </defs>
                        </svg>
                    </button>
                    <button className="action-btn-addnew" onClick={handleAddNewClick}>
                        <svg width="129" height="24" viewBox="0 0 129 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clip-path="url(#clip0_4_34488)">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M12 7C12.2652 7 12.5196 7.10536 12.7071 7.29289C12.8946 7.48043 13 7.73478 13 8V11H16C16.2652 11 16.5196 11.1054 16.7071 11.2929C16.8946 11.4804 17 11.7348 17 12C17 12.2652 16.8946 12.5196 16.7071 12.7071C16.5196 12.8946 16.2652 13 16 13H13V16C13 16.2652 12.8946 16.5196 12.7071 16.7071C12.5196 16.8946 12.2652 17 12 17C11.7348 17 11.4804 16.8946 11.2929 16.7071C11.1054 16.5196 11 16.2652 11 16V13H8C7.73478 13 7.48043 12.8946 7.29289 12.7071C7.10536 12.5196 7 12.2652 7 12C7 11.7348 7.10536 11.4804 7.29289 11.2929C7.48043 11.1054 7.73478 11 8 11H11V8C11 7.73478 11.1054 7.48043 11.2929 7.29289C11.4804 7.10536 11.7348 7 12 7Z" fill="white" />
                                <path d="M34.3118 17H32.343L35.9276 6.81818H38.2045L41.794 17H39.8253L37.1058 8.90625H37.0263L34.3118 17ZM34.3764 13.0078H39.7457V14.4893H34.3764V13.0078ZM45.573 17.1342C44.9731 17.1342 44.4361 16.9801 43.9622 16.6719C43.4882 16.3636 43.1137 15.9162 42.8386 15.3295C42.5635 14.7429 42.4259 14.0303 42.4259 13.1918C42.4259 12.3433 42.5651 11.6274 42.8436 11.044C43.1253 10.4574 43.5048 10.0149 43.9821 9.71662C44.4593 9.41501 44.9913 9.2642 45.5779 9.2642C46.0254 9.2642 46.3933 9.34044 46.6816 9.4929C46.97 9.64205 47.1987 9.82268 47.3677 10.0348C47.5367 10.2436 47.6677 10.4408 47.7605 10.6264H47.835V6.81818H49.6397V17H47.8698V15.7969H47.7605C47.6677 15.9825 47.5334 16.1797 47.3578 16.3885C47.1821 16.594 46.9501 16.7696 46.6617 16.9155C46.3734 17.0613 46.0105 17.1342 45.573 17.1342ZM46.0751 15.6577C46.4562 15.6577 46.7811 15.5549 47.0495 15.3494C47.318 15.1406 47.5218 14.8506 47.661 14.4794C47.8002 14.1082 47.8698 13.6757 47.8698 13.1818C47.8698 12.688 47.8002 12.2588 47.661 11.8942C47.5251 11.5296 47.323 11.2462 47.0545 11.044C46.7893 10.8419 46.4629 10.7408 46.0751 10.7408C45.674 10.7408 45.3393 10.8452 45.0708 11.054C44.8024 11.2628 44.6002 11.5511 44.4643 11.919C44.3284 12.2869 44.2605 12.7079 44.2605 13.1818C44.2605 13.6591 44.3284 14.085 44.4643 14.4595C44.6035 14.8307 44.8073 15.1241 45.0758 15.3395C45.3476 15.5516 45.6807 15.6577 46.0751 15.6577ZM54.3073 17.1342C53.7074 17.1342 53.1705 16.9801 52.6965 16.6719C52.2226 16.3636 51.848 15.9162 51.5729 15.3295C51.2979 14.7429 51.1603 14.0303 51.1603 13.1918C51.1603 12.3433 51.2995 11.6274 51.5779 11.044C51.8596 10.4574 52.2391 10.0149 52.7164 9.71662C53.1937 9.41501 53.7256 9.2642 54.3123 9.2642C54.7597 9.2642 55.1276 9.34044 55.416 9.4929C55.7043 9.64205 55.933 9.82268 56.1021 10.0348C56.2711 10.2436 56.402 10.4408 56.4948 10.6264H56.5694V6.81818H58.3741V17H56.6042V15.7969H56.4948C56.402 15.9825 56.2678 16.1797 56.0921 16.3885C55.9165 16.594 55.6845 16.7696 55.3961 16.9155C55.1077 17.0613 54.7448 17.1342 54.3073 17.1342ZM54.8095 15.6577C55.1906 15.6577 55.5154 15.5549 55.7839 15.3494C56.0523 15.1406 56.2562 14.8506 56.3954 14.4794C56.5346 14.1082 56.6042 13.6757 56.6042 13.1818C56.6042 12.688 56.5346 12.2588 56.3954 11.8942C56.2595 11.5296 56.0573 11.2462 55.7889 11.044C55.5237 10.8419 55.1972 10.7408 54.8095 10.7408C54.4084 10.7408 54.0737 10.8452 53.8052 11.054C53.5367 11.2628 53.3345 11.5511 53.1987 11.919C53.0628 12.2869 52.9948 12.7079 52.9948 13.1818C52.9948 13.6591 53.0628 14.085 53.1987 14.4595C53.3379 14.8307 53.5417 15.1241 53.8102 15.3395C54.0819 15.5516 54.415 15.6577 54.8095 15.6577ZM72.0433 6.81818V17H70.4026L65.6051 10.0646H65.5205V17H63.6761V6.81818H65.3266L70.1193 13.7585H70.2087V6.81818H72.0433ZM77.2702 17.1491C76.5045 17.1491 75.8433 16.9901 75.2865 16.6719C74.733 16.3504 74.3071 15.8963 74.0088 15.3097C73.7105 14.7197 73.5614 14.0253 73.5614 13.2266C73.5614 12.4411 73.7105 11.7517 74.0088 11.1584C74.3104 10.5618 74.7313 10.0978 75.2716 9.76633C75.8118 9.43158 76.4465 9.2642 77.1757 9.2642C77.6463 9.2642 78.0905 9.34044 78.5081 9.4929C78.929 9.64205 79.3002 9.87405 79.6217 10.1889C79.9465 10.5038 80.2017 10.9048 80.3874 11.392C80.573 11.8759 80.6658 12.4527 80.6658 13.1222V13.674H74.4065V12.4609H78.9406C78.9373 12.1162 78.8627 11.8097 78.7169 11.5412C78.5711 11.2694 78.3672 11.0556 78.1054 10.8999C77.8469 10.7441 77.5453 10.6662 77.2006 10.6662C76.8327 10.6662 76.5095 10.7557 76.2311 10.9347C75.9527 11.1103 75.7356 11.3423 75.5798 11.6307C75.4274 11.9157 75.3495 12.2289 75.3462 12.5703V13.6293C75.3462 14.0734 75.4274 14.4545 75.5898 14.7727C75.7522 15.0876 75.9792 15.3295 76.2709 15.4986C76.5625 15.6643 76.9039 15.7472 77.295 15.7472C77.5569 15.7472 77.7938 15.7107 78.006 15.6378C78.2181 15.5616 78.402 15.4505 78.5578 15.3047C78.7136 15.1589 78.8312 14.9782 78.9108 14.7628L80.5912 14.9517C80.4851 15.3958 80.2829 15.7836 79.9847 16.1151C79.6897 16.4432 79.3118 16.6984 78.8511 16.8807C78.3904 17.0597 77.8634 17.1491 77.2702 17.1491ZM83.6393 17L81.4816 9.36364H83.3161L84.6585 14.733H84.7281L86.1002 9.36364H87.9149L89.287 14.7031H89.3616L90.684 9.36364H92.5235L90.3609 17H88.4866L87.0548 11.8395H86.9504L85.5185 17H83.6393ZM97.1643 17V6.81818H103.687V8.36435H99.0088V11.1286H103.24V12.6747H99.0088V17H97.1643ZM105.204 17V9.36364H107.004V17H105.204ZM106.109 8.27983C105.824 8.27983 105.578 8.18537 105.373 7.99645C105.167 7.80421 105.065 7.57386 105.065 7.3054C105.065 7.03362 105.167 6.80327 105.373 6.61435C105.578 6.42211 105.824 6.32599 106.109 6.32599C106.397 6.32599 106.642 6.42211 106.845 6.61435C107.05 6.80327 107.153 7.03362 107.153 7.3054C107.153 7.57386 107.05 7.80421 106.845 7.99645C106.642 8.18537 106.397 8.27983 106.109 8.27983ZM112.151 17.1491C111.385 17.1491 110.724 16.9901 110.167 16.6719C109.614 16.3504 109.188 15.8963 108.89 15.3097C108.591 14.7197 108.442 14.0253 108.442 13.2266C108.442 12.4411 108.591 11.7517 108.89 11.1584C109.191 10.5618 109.612 10.0978 110.152 9.76633C110.693 9.43158 111.327 9.2642 112.056 9.2642C112.527 9.2642 112.971 9.34044 113.389 9.4929C113.81 9.64205 114.181 9.87405 114.503 10.1889C114.827 10.5038 115.083 10.9048 115.268 11.392C115.454 11.8759 115.547 12.4527 115.547 13.1222V13.674H109.287V12.4609H113.821C113.818 12.1162 113.744 11.8097 113.598 11.5412C113.452 11.2694 113.248 11.0556 112.986 10.8999C112.728 10.7441 112.426 10.6662 112.081 10.6662C111.713 10.6662 111.39 10.7557 111.112 10.9347C110.833 11.1103 110.616 11.3423 110.461 11.6307C110.308 11.9157 110.23 12.2289 110.227 12.5703V13.6293C110.227 14.0734 110.308 14.4545 110.471 14.7727C110.633 15.0876 110.86 15.3295 111.152 15.4986C111.443 15.6643 111.785 15.7472 112.176 15.7472C112.438 15.7472 112.675 15.7107 112.887 15.6378C113.099 15.5616 113.283 15.4505 113.439 15.3047C113.594 15.1589 113.712 14.9782 113.792 14.7628L115.472 14.9517C115.366 15.3958 115.164 15.7836 114.865 16.1151C114.57 16.4432 114.193 16.6984 113.732 16.8807C113.271 17.0597 112.744 17.1491 112.151 17.1491ZM118.785 6.81818V17H116.985V6.81818H118.785ZM123.385 17.1342C122.785 17.1342 122.248 16.9801 121.774 16.6719C121.301 16.3636 120.926 15.9162 120.651 15.3295C120.376 14.7429 120.238 14.0303 120.238 13.1918C120.238 12.3433 120.377 11.6274 120.656 11.044C120.938 10.4574 121.317 10.0149 121.794 9.71662C122.272 9.41501 122.804 9.2642 123.39 9.2642C123.838 9.2642 124.206 9.34044 124.494 9.4929C124.782 9.64205 125.011 9.82268 125.18 10.0348C125.349 10.2436 125.48 10.4408 125.573 10.6264H125.647V6.81818H127.452V17H125.682V15.7969H125.573C125.48 15.9825 125.346 16.1797 125.17 16.3885C124.994 16.594 124.762 16.7696 124.474 16.9155C124.186 17.0613 123.823 17.1342 123.385 17.1342ZM123.887 15.6577C124.269 15.6577 124.593 15.5549 124.862 15.3494C125.13 15.1406 125.334 14.8506 125.473 14.4794C125.613 14.1082 125.682 13.6757 125.682 13.1818C125.682 12.688 125.613 12.2588 125.473 11.8942C125.337 11.5296 125.135 11.2462 124.867 11.044C124.602 10.8419 124.275 10.7408 123.887 10.7408C123.486 10.7408 123.152 10.8452 122.883 11.054C122.615 11.2628 122.413 11.5511 122.277 11.919C122.141 12.2869 122.073 12.7079 122.073 13.1818C122.073 13.6591 122.141 14.085 122.277 14.4595C122.416 14.8307 122.62 15.1241 122.888 15.3395C123.16 15.5516 123.493 15.6577 123.887 15.6577Z" fill="#F6F8F9" />
                            </g>
                            <defs>
                                <clipPath id="clip0_4_34488">
                                    <rect width="129" height="24" fill="white" />
                                </clipPath>
                            </defs>
                        </svg>
                    </button>
                </div>
            </div>

            <div className="feeheads-table-container">
                <table className="feeheads-table">
                    <thead className="table-head">
                        <tr>
                            <th className="sticky-col-sticky-col-1"><input type="checkbox" /></th>
                            <th>ACCOUNT ID</th>
                            <th>ACCOUNT NAME</th>
                            <th>ACCOUNT NUMBER</th>
                            <th>ACCOUNT TYPE</th>
                            <th>BANK ADDRESS</th>
                            <th>BANK BRANCH</th>
                            <th>BANK NAME</th>
                            <th>IFSC CODE</th>
                            <th>MICR CODE</th>
                            <th>ORGANIZATION ID</th>
                            <th>BANK BRANCH SOL ID</th>
                            <th>CAMPUS ID</th>
                            <th>ACTIVE STATUS</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {tableData.map((row) => (
                            <tr key={row.accountId} className="table-row">
                                <td className="sticky-col-sticky-col-1"><input type="checkbox" /></td>
                                <td>{row.accountId}</td>
                                <td>{row.accountName}</td>
                                <td>{row.accountNumber}</td>
                                <td>{row.accountType}</td>
                                <td>{row.bankAddress}</td>
                                <td>{row.bankBranch}</td>
                                <td>{row.bankName}</td>
                                <td>{row.ifscCode}</td>
                                <td>{row.micrCode}</td>
                                <td>{row.organizationId}</td>
                                <td>{row.bankBranchSolId}</td>
                                <td>{row.campusId}</td>
                                <td>{row.activeStatus}</td>
                                <td className="icons">
                                    <button title="Delete" className="icon-btn" onClick={() => handleDeleteClick(row.accountId)}>
                                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M2.5 5.00033H4.16667M4.16667 5.00033H17.5M4.16667 5.00033V16.667C4.16667 17.109 4.34226 17.5329 4.65482 17.8455C4.96738 18.1581 5.39131 18.3337 5.83333 18.3337H14.1667C14.6087 18.3337 15.0326 18.1581 15.3452 17.8455C15.6577 17.5329 15.8333 17.109 15.8333 16.667V5.00033H4.16667ZM6.66667 5.00033V3.33366C6.66667 2.89163 6.84226 2.46771 7.15482 2.15515C7.46738 1.84259 7.89131 1.66699 8.33333 1.66699H11.6667C12.1087 1.66699 12.5326 1.84259 12.8452 2.15515C13.1577 2.46771 13.3333 2.89163 13.3333 3.33366V5.00033M8.33333 9.16699V14.167M11.6667 9.16699V14.167" stroke="#667085" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" />
                                        </svg>
                                    </button>
                                    <button title="Edit" className="icon-btn" onClick={() => handleViewClick(row.accountId)}>
                                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <g clip-path="url(#clip0_363_3927)">
                                                <path d="M14.1665 2.49993C14.3854 2.28106 14.6452 2.10744 14.9312 1.98899C15.2171 1.87054 15.5236 1.80957 15.8332 1.80957C16.1427 1.80957 16.4492 1.87054 16.7352 1.98899C17.0211 2.10744 17.281 2.28106 17.4998 2.49993C17.7187 2.7188 17.8923 2.97863 18.0108 3.2646C18.1292 3.55057 18.1902 3.85706 18.1902 4.16659C18.1902 4.47612 18.1292 4.78262 18.0108 5.06859C17.8923 5.35455 17.7187 5.61439 17.4998 5.83326L6.24984 17.0833L1.6665 18.3333L2.9165 13.7499L14.1665 2.49993Z" stroke="#667085" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" />
                                            </g>
                                            <defs>
                                                <clipPath id="clip0_363_3927">
                                                    <rect width="20" height="20" fill="white" />
                                                </clipPath>
                                            </defs>
                                        </svg>
                                    </button>
                                    <button title="View" className="icon-btn" onClick={() => handleViewClick(row.accountId)}>
                                        <svg width="48" height="16" viewBox="0 0 48 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M14.8628 7.36301C15.0655 7.64701 15.1668 7.78967 15.1668 7.99967C15.1668 8.21034 15.0655 8.35234 14.8628 8.63634C13.9522 9.91367 11.6262 12.6663 8.50016 12.6663C5.3735 12.6663 3.04816 9.91301 2.1375 8.63634C1.93483 8.35234 1.8335 8.20967 1.8335 7.99967C1.8335 7.78901 1.93483 7.64701 2.1375 7.36301C3.04816 6.08567 5.37416 3.33301 8.50016 3.33301C11.6268 3.33301 13.9522 6.08634 14.8628 7.36301Z" stroke="#7B7B7B" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round" />
                                            <path d="M10.5 8C10.5 7.46957 10.2893 6.96086 9.91421 6.58579C9.53914 6.21071 9.03043 6 8.5 6C7.96957 6 7.46086 6.21071 7.08579 6.58579C6.71071 6.96086 6.5 7.46957 6.5 8C6.5 8.53043 6.71071 9.03914 7.08579 9.41421C7.46086 9.78929 7.96957 10 8.5 10C9.03043 10 9.53914 9.78929 9.91421 9.41421C10.2893 9.03914 10.5 8.53043 10.5 8Z" stroke="#7B7B7B" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round" />
                                            <path d="M20.9148 4.27273L23.5057 11.6193H23.608L26.1989 4.27273H27.3068L24.1023 13H23.0114L19.8068 4.27273H20.9148ZM28.5298 13V6.45455H29.5355V13H28.5298ZM29.0412 5.36364C28.8452 5.36364 28.6761 5.29688 28.5341 5.16335C28.3949 5.02983 28.3253 4.86932 28.3253 4.68182C28.3253 4.49432 28.3949 4.33381 28.5341 4.20028C28.6761 4.06676 28.8452 4 29.0412 4C29.2372 4 29.4048 4.06676 29.544 4.20028C29.6861 4.33381 29.7571 4.49432 29.7571 4.68182C29.7571 4.86932 29.6861 5.02983 29.544 5.16335C29.4048 5.29688 29.2372 5.36364 29.0412 5.36364ZM34.1218 13.1364C33.4911 13.1364 32.9471 12.9972 32.4897 12.7188C32.0352 12.4375 31.6843 12.0455 31.4371 11.5426C31.1928 11.0369 31.0707 10.4489 31.0707 9.77841C31.0707 9.10795 31.1928 8.51705 31.4371 8.00568C31.6843 7.49148 32.0281 7.09091 32.4684 6.80398C32.9116 6.5142 33.4286 6.36932 34.0195 6.36932C34.3604 6.36932 34.6971 6.42614 35.0295 6.53977C35.3619 6.65341 35.6644 6.83807 35.9371 7.09375C36.2099 7.34659 36.4272 7.68182 36.5891 8.09943C36.7511 8.51705 36.832 9.03125 36.832 9.64205V10.0682H31.7866V9.19886H35.8093C35.8093 8.82955 35.7354 8.5 35.5877 8.21023C35.4428 7.92045 35.2354 7.69176 34.9656 7.52415C34.6985 7.35653 34.3832 7.27273 34.0195 7.27273C33.619 7.27273 33.2724 7.37216 32.9798 7.57102C32.69 7.76705 32.467 8.02273 32.3107 8.33807C32.1545 8.65341 32.0763 8.99148 32.0763 9.35227V9.93182C32.0763 10.4261 32.1616 10.8452 32.332 11.1889C32.5053 11.5298 32.7454 11.7898 33.0522 11.9688C33.359 12.1449 33.7156 12.233 34.1218 12.233C34.386 12.233 34.6246 12.196 34.8377 12.1222C35.0536 12.0455 35.2397 11.9318 35.396 11.7812C35.5522 11.6278 35.6729 11.4375 35.7582 11.2102L36.7298 11.483C36.6275 11.8125 36.4556 12.1023 36.2141 12.3523C35.9727 12.5994 35.6744 12.7926 35.3192 12.9318C34.9641 13.0682 34.565 13.1364 34.1218 13.1364ZM39.8448 13L37.8505 6.45455H38.9073L40.3221 11.4659H40.3903L41.788 6.45455H42.8619L44.2425 11.4489H44.3107L45.7255 6.45455H46.7823L44.788 13H43.7994L42.3675 7.97159H42.2653L40.8335 13H39.8448Z" fill="#7B7B7B" />
                                        </svg>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showForm && (
                <>
                    <div className="overlay"></div>
                    <div className="form-popup">
                        <h3>{isEditMode ? "Edit" : "Add New Field"}</h3>
                        <button className="close-btn" onClick={handleCancel}>
                            <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9 8.75L21.5 21.25M9 21.25L21.5 8.75" stroke="black" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                        </button>
                        <div className="feeheads-form">
                            <label>
                                <span>Account Id</span>
                                <input
                                    type="text"
                                    className="input-accountId"
                                    name="accountId"
                                    value={formData.accountId}
                                    onChange={handleChange}
                                    placeholder="Enter Account Id"
                                    disabled={isEditMode} // Prevent editing accountId in edit mode since it's the ID
                                />
                            </label>
                            <label>
                                <span>Account Name</span>
                                <input
                                    type="text"
                                    className="input-accountName"
                                    name="accountName"
                                    value={formData.accountName}
                                    onChange={handleChange}
                                    placeholder="Enter Account Name"
                                />
                            </label>
                            <label>
                                <span>Account Number</span>
                                <input
                                    type="text"
                                    className="input-accountNumber"
                                    name="accountNumber"
                                    value={formData.accountNumber}
                                    onChange={handleChange}
                                    placeholder="Enter Account Number"
                                />
                            </label>
                            <label>
                                <span>Account Type</span>
                                <input
                                    type="text"
                                    className="input-accountType"
                                    name="accountType"
                                    value={formData.accountType}
                                    onChange={handleChange}
                                    placeholder="Enter Account Type"
                                />
                            </label>
                            <label>
                                <span>Bank Address</span>
                                <input
                                    type="text"
                                    className="input-bankAddress"
                                    name="bankAddress"
                                    value={formData.bankAddress}
                                    onChange={handleChange}
                                    placeholder="Enter Bank Address"
                                />
                            </label>
                            <label>
                                <span>Bank Branch</span>
                                <input
                                    type="text"
                                    className="input-bankBranch"
                                    name="bankBranch"
                                    value={formData.bankBranch}
                                    onChange={handleChange}
                                    placeholder="Enter Bank Branch"
                                />
                            </label>
                            <label>
                                <span>Bank Name</span>
                                <input
                                    type="text"
                                    className="input-bankName"
                                    name="bankName"
                                    value={formData.bankName}
                                    onChange={handleChange}
                                    placeholder="Enter Bank Name"
                                />
                            </label>
                            <label>
                                <span>Ifsc Code</span>
                                <input
                                    type="text"
                                    className="input-ifscCode"
                                    name="ifscCode"
                                    value={formData.ifscCode}
                                    onChange={handleChange}
                                    placeholder="Enter Ifsc Code"
                                />
                            </label>
                            <label>
                                <span>Micr Code</span>
                                <input
                                    type="text"
                                    className="input-micrCode"
                                    name="micrCode"
                                    value={formData.micrCode}
                                    onChange={handleChange}
                                    placeholder="Enter Micr Code"
                                />
                            </label>
                            <label>
                                <span>Organization Id</span>
                                <input
                                    type="text"
                                    className="input-organizationId"
                                    name="organizationId"
                                    value={formData.organizationId}
                                    onChange={handleChange}
                                    placeholder="Enter Organization Id"
                                />
                            </label>
                            <label>
                                <span>Bank Branch Sol Id</span>
                                <input
                                    type="text"
                                    className="input-bankBranchSolId"
                                    name="bankBranchSolId"
                                    value={formData.bankBranchSolId}
                                    onChange={handleChange}
                                    placeholder="Enter Bank Branch Sol Id"
                                />
                            </label>
                            <label>
                                <span>Campus Id</span>
                                <input
                                    type="text"
                                    className="input-campusId"
                                    name="campusId"
                                    value={formData.campusId}
                                    onChange={handleChange}
                                    placeholder="Enter Campus Id"
                                />
                            </label>
                            <label>
                                <span>Active Status</span>
                                <input
                                    type="text"
                                    className="input-activeStatus"
                                    name="activeStatus"
                                    value={formData.activeStatus}
                                    onChange={handleChange}
                                    placeholder="Enter Active Status"
                                />
                            </label>
                            <div className="form-buttons">
                                {!isEditMode && (
                                    <button type="button" onClick={handleCancel} className="cancel-btn">
                                        Cancel
                                    </button>
                                )}
                                {isEditMode && (
                                    <button
                                        type="button"
                                        onClick={() => handleDeleteClick(editAccountId)}
                                        className="delete-btn"
                                    >
                                        Delete
                                    </button>
                                )}
                                <button type="button" onClick={handleAddField} className="add-btn">
                                    {isEditMode ? "Edit" : "Add New Field"}
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Organization;