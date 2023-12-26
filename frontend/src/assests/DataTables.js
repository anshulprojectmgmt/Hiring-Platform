export const users_csv = `user_id,username,first_name,last_name,email
1,johndoe,John,Doe,johndoe@example.com
2,alice_smith,Alice,Smith,alice.smith@example.com
3,bob_jones,Bob,Jones,bob.jones@example.com
4,lisa_wang,Lisa,Wang,lisa.wang@example.com
5,michael_davis,Michael,Davis,michael.davis@example.com`;

export const products_csv = `product_id,product_name,description,price,stock_quantity
101,Laptop,High-performance laptop,999.99,50
102,Smartphone,Latest smartphone model,599.99,100
103,Tablet,10-inch tablet,299.99,75
104,Headphones,Wireless headphones,129.99,200
105,Keyboard,Mechanical keyboard,79.99,150`;

export const orders_csv = `order_id,user_id,order_date,total_amount
1,1,2023-01-15,1249.98
2,2,2023-01-16,599.99
3,3,2023-01-16,299.99
4,1,2023-01-17,129.99
5,4,2023-01-18,999.99`;

export const ordersDetails_csv = `order_detail_id,order_id,product_id,quantity,unit_price
1,1,101,1,999.99
2,2,102,1,599.99
3,3,103,2,599.98
4,4,104,3,389.97
5,5,105,2,159.98
`;
