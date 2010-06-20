<%@ page import="au.org.ala.collectory.ReportsController.ReportCommand" %>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <meta name="layout" content="main" />
        <title>Registry database reports</title>
    </head>
    <body>
        <div class="nav">
            <span class="menuButton"><a class="home" href="${createLink(uri: '/')}"><g:message code="default.home.label"/></a></span>
        </div>
        <div class="body">
            <h1>Reports</h1>
            <g:if test="${flash.message}">
            <div class="message">${flash.message}</div>
            </g:if>
            <div class="dialog">
              <table>
                <colgroup><col width="40%"/><col width="10%"/><col width="50%"/></colgroup>

                <tr class="reportGroupTitle"><td colspan="3">Totals</td></tr>
                <tr><td>Collections</td><td>${reports.totalCollections}</td><td></td></tr>
                <tr><td>Institutions</td><td>${reports.totalInstitutions}</td><td></td></tr>
                <tr><td>Contacts</td><td>${reports.totalContacts}</td><td></td></tr>
                <tr><td>Login accounts</td><td>${reports.totalLogons}</td><td></td></tr>

                <tr class="reportGroupTitle"><td colspan="3">Collection data quality</td></tr>
                <tr><cl:totalAndPercent label="Collections with no collection type" without="${reports.collectionsWithType}" total="${reports.totalCollections}"/></tr>
                <tr><cl:totalAndPercent label="Collections with no focus" without="${reports.collectionsWithFocus}" total="${reports.totalCollections}"/></tr>
                <tr><cl:totalAndPercent label="Collections with no description" without="${reports.collectionsWithDescriptions}" total="${reports.totalCollections}"/></tr>
                <tr><cl:totalAndPercent label="Collections with no keywords" without="${reports.collectionsWithKeywords}" total="${reports.totalCollections}"/></tr>
                <tr><cl:totalAndPercent label="Collections with no provider codes" without="${reports.collectionsWithProviderCodes}" total="${reports.totalCollections}"/></tr>
                <tr><cl:totalAndPercent label="Collections with no geo. description" without="${reports.collectionsWithGeoDescription}" total="${reports.totalCollections}"/></tr>
                <tr><cl:totalAndPercent label="Collections with no size" without="${reports.collectionsWithNumRecords}" total="${reports.totalCollections}"/></tr>
                <tr><cl:totalAndPercent label="Collections with no digitised size" without="${reports.collectionsWithNumRecordsDigitised}" total="${reports.totalCollections}"/></tr>

                <tr class="reportGroupTitle"><td colspan="3">Contact summary</td></tr>
                <tr><cl:totalAndPercent label="Collections with no contacts" with="${reports.collectionsWithoutContacts}" total="${reports.totalCollections}"/></tr>
                <tr><cl:totalAndPercent label="Collections with no email contacts" with="${reports.collectionsWithoutEmailContacts}" total="${reports.totalCollections}"/></tr>
                <tr><cl:totalAndPercent label="Institutions with no contacts" with="${reports.institutionsWithoutContacts}" total="${reports.totalInstitutions}"/></tr>
                <tr><cl:totalAndPercent label="Institutions with no email contacts" with="${reports.institutionsWithoutEmailContacts}" total="${reports.totalInstitutions}"/></tr>

                <tr class="reportGroupTitle"><td colspan="3">Infosource summary</td></tr>
                <tr><cl:totalAndPercent label="Collections with infosource data" with="${reports.collectionsWithInfosource}" total="${reports.totalCollections}"/></tr>

                <tr class="reportGroupTitle"><td colspan="3">User activity</td></tr>
                <tr><td>Total logins</td><td>${reports.totalLogins}</td><td></td></tr>
                <tr><td>Unique logins</td><td>${reports.uniqueLogins}</td><td></td></tr>
                <tr><td>Supplier logins</td><td>${reports.supplierLogins}</td><td></td></tr>
                <tr><td>Unique supplier logins</td><td>${reports.uniqueSupplierLogins}</td><td></td></tr>
                <tr><td>Curator views</td><td>${reports.curatorViews}</td><td></td></tr>
                <tr><td>Curator previews</td><td>${reports.curatorPreviews}</td><td></td></tr>
                <tr><td>Curator edits</td><td>${reports.curatorEdits}</td><td></td></tr>
              </table>
            </div>
        </div>
    </body>
</html>
