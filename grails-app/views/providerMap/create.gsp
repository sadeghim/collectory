
<%@ page import="au.org.ala.collectory.ProviderMap" %>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <meta name="layout" content="main" />
        <g:set var="entityName" value="${message(code: 'providerMap.label', default: 'ProviderMap')}" />
        <title><g:message code="default.create.label" args="[entityName]" /></title>
    </head>
    <body>
        <div class="nav">
            <span class="menuButton"><cl:homeLink/></span>
            <span class="menuButton"><g:link class="list" action="list"><g:message code="default.list.label" args="[entityName]" /></g:link></span>
        </div>
        <div class="body">
            <h1><g:message code="default.create.label" args="[entityName]" /></h1>
            <g:if test="${flash.message}">
            <div class="message">${flash.message}</div>
            </g:if>
            <g:hasErrors bean="${providerMapInstance}">
            <div class="errors">
                <g:renderErrors bean="${providerMapInstance}" as="list" />
            </div>
            </g:hasErrors>
            <g:form action="save" method="post" >
                <div class="dialog">
                    <table>
                        <tbody>
                        
                            <tr class="prop">
                                <td valign="top" class="name">
                                    <label for="providerGroup"><g:message code="providerMap.providerGroup.label" default="Provider Group" /></label>
                                </td>
                                <td valign="top" class="value ${hasErrors(bean: providerMapInstance, field: 'providerGroup', 'errors')}">
                                    <g:select name="providerGroup.id" from="${au.org.ala.collectory.ProviderGroup.findAllByGroupType('collection',[sort: 'name'])}" optionKey="id" value="${providerMapInstance?.providerGroup?.id}"  />
                                </td>
                            </tr>
                        
                            <tr class="prop">
                                <td valign="top" class="name">
                                  <label for="institutionCodes"><g:message code="providerMap.institutionCodes.label" default="Institution Codes" /></label>
                                </td>
                                <td valign="top" class="value ${hasErrors(bean: providerMapInstance, field: 'institutionCodes', 'errors')}">
                                    <g:select name="institutionCodes" from="${au.org.ala.collectory.ProviderCode.list([sort:'code'])}" multiple="yes" optionKey="id" size="5" value="${providerMapInstance?.institutionCodes*.id}" />
                                </td>
                            </tr>

                            <tr class="prop">
                                <td valign="top" class="name">
                                  <label for="collectionCodes"><g:message code="providerMap.collectionCodes.label" default="Collection Codes" /></label>
                                </td>
                                <td valign="top" class="value ${hasErrors(bean: providerMapInstance, field: 'collectionCodes', 'errors')}">
                                    <g:select name="collectionCodes" from="${au.org.ala.collectory.ProviderCode.list([sort:'code'])}" multiple="yes" optionKey="id" size="5" value="${providerMapInstance?.collectionCodes*.id}" />
                                </td>
                            </tr>

                            <tr class="prop">
                                <td valign="top" class="name">
                                    <label for="exact"><g:message code="providerMap.exact.label" default="Exact" /></label>
                                </td>
                                <td valign="top" class="value ${hasErrors(bean: providerMapInstance, field: 'exact', 'errors')}">
                                    <g:checkBox name="exact" value="${providerMapInstance?.exact}" />
                                </td>
                            </tr>
                        
                            <tr class="prop">
                                <td valign="top" class="name">
                                    <label for="matchAnyCollectionCode"><g:message code="providerMap.matchAnyCollectionCode.label" default="Match Any Collection Code" /></label>
                                </td>
                                <td valign="top" class="value ${hasErrors(bean: providerMapInstance, field: 'matchAnyCollectionCode', 'errors')}">
                                    <g:checkBox name="matchAnyCollectionCode" value="${providerMapInstance?.matchAnyCollectionCode}" />
                                </td>
                            </tr>
                        
                        </tbody>
                    </table>
                </div>
                <div class="buttons">
                    <span class="button"><g:submitButton name="create" class="save" value="${message(code: 'default.button.create.label', default: 'Create')}" /></span>
                </div>
            </g:form>
        </div>
    </body>
</html>