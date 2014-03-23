{extends file="skel/html.tpl"}
{block name="script_head"}
		<link rel="stylesheet" type="text/css" href="{$template.static}/css/bootstrap.min.css" />
		<link rel="stylesheet" type="text/css" href="{$template.static}/css/bootstrap-theme.min.css" />
		<link rel="stylesheet" type="text/css" href="{$template.static}/css/default.css" />
{/block}
{block name="script_body"}
		<script type="text/javascript" src="{$template.static}/js/jquery.min.js"></script>
		<script type="text/javascript" src="{$template.static}/js/bootstrap.min.js"></script>
		<script type="text/javascript" src="{$template.static}/js/default.js"></script>
		<script type="text/javascript">F.Initialize();</script>
{/block}
{block name="body"}
		{block name="template_header"}{/block}
		<div id="fcms-body" class="container-fluid">
			{block name="template_body"}{/block}
		</div>
		{block name="template_footer"}{/block}
{/block}
