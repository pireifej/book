#!/usr/bin/perl -w

use lib "./JSON-2.59/lib";
use JSON;

use CGI qw(:standard);
use strict;
use warnings;

my $command_name = "";
my $json_text = "";

my $query = new CGI;
if ($query->param()) {
	$command_name = $query->param('command_name');
}

# get required parameters from CGI
sub get_param($) {
	my $param_name = $_[0];
	my $param_value = $query->param($param_name);
	if (!defined($param_value) || $param_value eq "") {
		print "$param_name required for $command_name command\n";
		exit;
	}
	return $param_value;
}

# parse key/value from key=value format
sub get_key_value_pair($) {
	my $cell = $_[0];
	my @key_value_pair = split("=", $cell);
	my $key = $key_value_pair[0];
	my $value = (defined($key_value_pair[1]) && $key_value_pair[1] ne "") ? $key_value_pair[1] : "";
	return ($key, $value);
}

print header('application/json');

if ($command_name eq 'test') {
	my %test_info = ();
	$test_info{"hello"} = "world";
	$json_text = to_json(\%test_info);
	print $json_text;
	exit;
}

if ($json_text eq "") {
	print "Invalid command name $command_name\n";
	exit;
}
