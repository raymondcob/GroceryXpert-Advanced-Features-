<?php
require_once __DIR__ . '/vendor/autoload.php';


   

$products = json_decode($_POST['products'], true);
$grandTotal = $_POST['grandTotal'];

// Start building the PDF content
$html = '<h1>Budget Report</h1>';
$html .= '<table border="1" cellpadding="10" cellspacing="0" style="width:100%; border-collapse: collapse;">';
$html .= '<thead>
    <tr>
        <th>Product Name</th>
        <th>Quantity</th>
        <th>Listed Price</th>
        <th>Total Listed Price</th>
    </tr>
</thead>';
$html .= '<tbody>';

foreach ($products as $product) {
    $html .= '<tr>';
    $html .= '<td>' . htmlspecialchars($product['name']) . '</td>';
    $html .= '<td>' . htmlspecialchars($product['quantity']) . '</td>';
    $html .= '<td>$' . htmlspecialchars($product['listedPrice']) . '</td>';
    $html .= '<td>$' . htmlspecialchars($product['totalListedPrice']) . '</td>';
    $html .= '</tr>';
}

$html .= '</tbody>';
$html .= '<tfoot>
    <tr>
        <td colspan="3" style="text-align: right;"><strong>Grand Total:</strong></td>
        <td><strong>' . htmlspecialchars($grandTotal) . '</strong></td>
    </tr>
</tfoot>';
$html .= '</table>';


$mpdf = new \Mpdf\Mpdf();
$mpdf->WriteHTML($html);
$mpdf->Output('generated_report.pdf', 'I');


?>